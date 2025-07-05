require "test_helper"

class SupervisorsControllerTest < ActionDispatch::IntegrationTest
  # Author: William Pevytoe
  # Date: 7/2/2025
  #Testing methods for supervisor_controller
  setup do
    @supervisor = employees(:supervisor)

    @fy1 = fiscal_years(:one)
    @fy2 = fiscal_years(:two)

    @req1 = time_off_requests(:one)
    @req2 = time_off_requests(:two)

    @fye1 = fiscal_year_employees(:one)
    @fye2 = fiscal_year_employees(:two)
  end

  # Author: William Pevytoe
  # Date: 7/2/2025
  test "show defaults to current fiscal year" do
    get supervisor_url(@supervisor)
    assert_response :success

    payload = assigns(:time_off_requests_payload)
    assert_kind_of Array, payload

    current_fy = assigns(:fiscal_years).find { |fy| fy.start_date <= Date.current && fy.end_date >= Date.current }
    assert_equal current_fy.id, assigns(:selected_fy).id
  end

  # Author: William Pevytoe
  # Date: 7/2/2025
  test "show respects fiscal_year_id param" do
    get supervisor_url(@supervisor), params: { fiscal_year_id: @fy1.id }
    assert_response :success

    selected = assigns(:selected_fy)
    assert_equal @fy1.id, selected.id
  end

  # Author: William Pevytoe
  # Date: 7/2/2025
  test "show filters by status" do
    @req2.update!(final_decision_date: Date.current)
    get supervisor_url(@supervisor), params: { status: 'decided', fiscal_year_id: @fy2.id }
    assert_response :success

    payload = assigns(:time_off_requests_payload)
    assert_kind_of Array, payload
    assert payload.all? { |r| r[:status] == 'decided' }
  end

  # Author: William Pevytoe
  # Date: 7/2/2025
  test "show assigns selected_fy default to current" do
    get supervisor_url(@supervisor)
    assert_response :success

    selected = assigns(:selected_fy)
    current_fy = assigns(:fiscal_years).find { |fy| fy.start_date <= Date.current && fy.end_date >= Date.current }
    assert_equal current_fy.id, selected.id
  end

  # Author: William Pevytoe
  # Date: 7/2/2025
  test "show assigns selected_fy from param" do
    get supervisor_url(@supervisor), params: { fiscal_year_id: @fy1.id }
    assert_response :success

    selected = assigns(:selected_fy)
    assert_equal @fy1.id, selected.id
  end

  # Author: William Pevytoe
  # Date: 7/2/2025
  test "employee_records loads correct records" do
    get supervisor_url(@supervisor)
    assert_response :success

    fye_records = assigns(:fye_records)
    assert_kind_of Array, fye_records
    fye_records.each do |fye|
      assert fye[:employee_name].present?
    end
  end

  # Author: William Pevytoe
  # Date: 7/2/2025
  test "calendar data is grouped by date" do
    get supervisor_url(@supervisor)
    assert_response :success

    calendar_data = assigns(:calendar_data)
    assert_kind_of Hash, calendar_data
  end

  # Author: William Pevytoe
  # Date: 7/2/2025
  test "show falls back to first fiscal year when no current exists" do
    FiscalYear.update_all(start_date: 5.years.ago, end_date: 4.years.ago) # Force all outside current range

    get supervisor_url(@supervisor)
    assert_response :success

    selected = assigns(:selected_fy)
    expected = assigns(:fiscal_years).first
    assert_equal expected.id, selected.id
  end

  # Author: William Pevytoe
  # Date: 7/2/2025
  test "show handles supervisor with no team" do
    Employee.where(supervisor_id: @supervisor.id).update_all(supervisor_id: nil) # Remove all direct reports

    get supervisor_url(@supervisor)
    assert_response :success

    assert_equal [], assigns(:time_off_requests_payload)
    assert_equal({}, assigns(:calendar_data))
  end

  # Author: William Pevytoe
  # Date: 7/2/2025
  test "calendar data entries include required keys" do
    get supervisor_url(@supervisor)
    assert_response :success

    calendar_data = assigns(:calendar_data)
    assert_kind_of Hash, calendar_data
    refute_empty calendar_data

    first_date, entries = calendar_data.first
    assert_kind_of Date, first_date
    assert_kind_of Array, entries
    refute_empty entries

    entry = entries.first
    %i[date employee_name reason amount status].each do |key|
      assert entry.key?(key), "Missing key #{key}"
    end
  end

  # Author: William Pevytoe
  # Date: 7/2/2025
  test "time_off_requests_payload includes decision breakdown keys" do
    get supervisor_url(@supervisor)
    assert_response :success

    payload = assigns(:time_off_requests_payload)
    assert_kind_of Array, payload
    refute_empty payload

    breakdown = payload.first[:decision_breakdown]
    assert breakdown.key?("approved")
    assert breakdown.key?("denied")
    assert breakdown.key?("pending")
  end

  # Author: William Pevytoe
  # Date: 7/2/2025
  test "fye_records is empty if no fiscal year param and no current FY" do
    FiscalYear.update_all(start_date: 10.years.ago, end_date: 9.years.ago) # all in the past

    get supervisor_url(@supervisor)
    assert_response :success

    selected = assigns(:selected_fy)
    assert_not_nil selected

    FiscalYearEmployee.where(fiscal_year_id: selected.id).delete_all
    get supervisor_url(@supervisor), params: { fiscal_year_id: selected.id }

    assert_equal [], assigns(:fye_records)
  end

  # Author: William Pevytoe
  # Date: 7/4/2025
  test "show handles nonexistent fiscal_year_id param" do
    get supervisor_url(@supervisor), params: { fiscal_year_id: 999_999 }
    assert_response :success

    assert_nil assigns(:selected_fy)
    assert_equal [], assigns(:fye_records)

    payload = assigns(:time_off_requests_payload)
    assert_kind_of Array, payload
    assert payload.any?, "Expected some requests when fiscal_year_id is invalid"
  end

  # Author: William Pevytoe
  # Date: 7/4/2025
  test "show filters by status with no matches yields empty payload" do
    get supervisor_url(@supervisor), params: { status: 'nonexistent', fiscal_year_id: @fy1.id }
    assert_response :success

    assert_equal [], assigns(:time_off_requests_payload),
                 "Expected no requests when filtering by a status that doesn't exist"
  end

  # Author: William Pevytoe
  # Date: 7/4/2025
  test "show does not filter by status when status param is blank" do
    get supervisor_url(@supervisor), params: { status: '', fiscal_year_id: @fy1.id }
    assert_response :success

    payload = assigns(:time_off_requests_payload)
    assert_kind_of Array, payload
    assert payload.size >= 1, "Expected requests for blank status"
  end
end