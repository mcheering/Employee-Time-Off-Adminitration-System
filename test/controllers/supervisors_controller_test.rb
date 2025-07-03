require "test_helper"

class SupervisorsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @supervisor = employees(:one)

    @fy1 = fiscal_years(:one)
    @fy2 = fiscal_years(:two)

    @req1 = time_off_requests(:one)
    @req2 = time_off_requests(:two)

    @fye1 = fiscal_year_employees(:one)
    @fye2 = fiscal_year_employees(:two)
  end

  test "show defaults to current fiscal year" do
    get supervisor_url(@supervisor)
    assert_response :success

    payload = assigns(:time_off_requests_payload)
    assert_kind_of Array, payload

    current_fy = assigns(:fiscal_years).find { |fy| fy.start_date <= Date.current && fy.end_date >= Date.current }
    assert_equal current_fy.id, assigns(:selected_fy).id
  end

  test "show respects fiscal_year_id param" do
    get supervisor_url(@supervisor), params: { fiscal_year_id: @fy1.id }
    assert_response :success

    selected = assigns(:selected_fy)
    assert_equal @fy1.id, selected.id
  end

  test "show filters by status" do
    @req2.update!(final_decision_date: Date.current)
    get supervisor_url(@supervisor), params: { status: 'decided', fiscal_year_id: @fy2.id }
    assert_response :success

    payload = assigns(:time_off_requests_payload)
    assert_kind_of Array, payload
    assert payload.all? { |r| r[:status] == 'decided' }
  end

  test "show assigns selected_fy default to current" do
    get supervisor_url(@supervisor)
    assert_response :success

    selected = assigns(:selected_fy)
    current_fy = assigns(:fiscal_years).find { |fy| fy.start_date <= Date.current && fy.end_date >= Date.current }
    assert_equal current_fy.id, selected.id
  end

  test "show assigns selected_fy from param" do
    get supervisor_url(@supervisor), params: { fiscal_year_id: @fy1.id }
    assert_response :success

    selected = assigns(:selected_fy)
    assert_equal @fy1.id, selected.id
  end

  test "employee_records loads correct records" do
    get supervisor_url(@supervisor)
    assert_response :success

    fye_records = assigns(:fye_records)
    assert_kind_of Array, fye_records
    fye_records.each do |fye|
      assert fye[:employee_name].present?
    end
  end

  test "calendar data is grouped by date" do
    get supervisor_url(@supervisor)
    assert_response :success

    calendar_data = assigns(:calendar_data)
    assert_kind_of Hash, calendar_data
  end
end