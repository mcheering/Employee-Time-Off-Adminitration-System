require "test_helper"

class SupervisorsControllerTest < ActionDispatch::IntegrationTest
  # no authentication required for these endpoints

  setup do
    @supervisor = employees(:one)

    # Fiscal years from fixtures
    @fy1 = fiscal_years(:one)
    @fy2 = fiscal_years(:two)

    # TimeOffRequests fixtures
    @req1 = time_off_requests(:one)
    @req2 = time_off_requests(:two)

    # Join records from fixtures
    @fye1 = fiscal_year_employees(:one)
    @fye2 = fiscal_year_employees(:two)
  end

  test "show defaults to current fiscal year" do
    get supervisor_url(@supervisor)
    assert_response :success

    reqs = assigns(:time_off_requests)
    assert_kind_of Array, reqs

    current_fy = assigns(:fiscal_years).find { |fy| fy.start_date <= Date.current && fy.end_date >= Date.current }
    assert reqs.all? { |r| r.fiscal_year_employee.fiscal_year_id == current_fy.id }
  end

  test "show respects fiscal_year_id param" do
    get supervisor_url(@supervisor), params: { fiscal_year_id: @fy1.id }
    assert_response :success

    reqs = assigns(:time_off_requests)
    assert_kind_of Array, reqs
    assert reqs.all? { |r| r.fiscal_year_employee.fiscal_year_id == @fy1.id }
  end

  test "show filters by status" do
    @req2.update!(final_decision_date: Date.current)
    get supervisor_url(@supervisor), params: { status: 'decided', fiscal_year_id: @fy2.id }
    assert_response :success

    reqs = assigns(:time_off_requests)
    assert_kind_of Array, reqs
    assert_includes reqs, @req2
    assert reqs.all? { |r| r.status.to_s == 'decided' }
  end

  test "calendar action returns grouped by_date" do
    get calendar_supervisor_url(@supervisor)
    assert_response :success

    assert_kind_of ActiveRecord::Relation, assigns(:fiscal_years)
    by_date = assigns(:by_date)
    assert_kind_of Hash, by_date
  end

  test "show assigns selected_fy default to current" do
    get supervisor_url(@supervisor)
    assert_response :success

    selected = assigns(:selected_fy)
    current_fy = assigns(:fiscal_years).find { |fy| fy.start_date <= Date.current && fy.end_date >= Date.current }
    assert_equal current_fy.id, selected
  end

  test "show assigns selected_fy from param" do
    get supervisor_url(@supervisor), params: { fiscal_year_id: @fy1.id }
    assert_response :success

    assert_equal @fy1.id.to_s, assigns(:selected_fy)
  end

  test "employee_records loads correct records" do
    get employee_records_supervisor_url(@supervisor)
    assert_response :success

    fye_records = assigns(:fye_records)
    assert_kind_of ActiveRecord::Relation, fye_records
    fye_records.each do |fye|
      assert_equal @supervisor.id, fye.employee.supervisor_id
    end
  end
end
