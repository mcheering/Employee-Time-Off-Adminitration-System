require "test_helper"

class SupervisorsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @supervisor = employees(:supervisor)
    @employee = employees(:one)
    @fiscal_year = fiscal_years(:one)
    @fye = fiscal_year_employees(:one)
    @time_off_request = time_off_requests(:one)
  end

  test "should load supervisor show view with data" do
    get supervisor_path(@supervisor)

    assert_response :success
    assert_equal @supervisor, assigns(:supervisor)
    assert_includes assigns(:fiscal_years), @fiscal_year
    assert_equal @fiscal_year.id.to_s, assigns(:selected_fy).to_s

    payload = assigns(:time_off_requests_payload)
    assert_not_empty payload
    assert_equal "vacation", payload.first[:reason]

    calendar = assigns(:calendar_data)
    assert calendar.present?
    assert calendar.values.flatten.any? { |entry| entry[:status].present? }

    records = assigns(:fye_records)
    assert records.any? { |r| r[:employee_name] == @employee.name }
  end

  test "should filter time-off requests by status" do
    get supervisor_path(@supervisor), params: {
      status: "decided",
      fiscal_year_id: @fiscal_year.id
    }

    assert_response :success
    filtered = assigns(:time_off_requests_payload)
    assert_not_empty filtered
    assert_equal "decided", filtered.first[:status]
  end
end