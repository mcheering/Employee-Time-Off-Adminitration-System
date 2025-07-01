require "test_helper"

class TimeOffRequestTest < ActiveSupport::TestCase
  # Author: Terry Thompson
  # 6/27/2025
  test "should create time_off_request with valid data" do
    request = TimeOffRequest.new
    assert request.invalid?
    assert request.errors[:fiscal_year_employee].any?
    assert request.errors[:supervisor_id].any?
    assert request.errors[:submitted_by_id].any?
    assert request.errors[:request_date].any?
    assert request.errors[:reason].any?
  end

  # Author: Terry Thompson
  # 6/30/2025
  test "employee name equals fiscal year employee name" do
    employee = fiscal_year_employees(:one)
    request = time_off_requests(:one)
    assert_equal employee.employee_name, request.employee_name
  end

  # Author: Terry Thompson
  # 6/30/2025
  test "fiscal_year_caption equals fiscal_year_employee.fiscal_year_caption" do
    employee = fiscal_year_employees(:one)
    request = time_off_requests(:one)
    assert_equal employee.fiscal_year_caption, request.fiscal_year_caption
  end

  # Author: Terry Thompson
  # 6/30/2025
  test "supervisor_name equals supervisor.name" do
    request = time_off_requests(:one)
    supervisor = request.supervisor
    assert_equal supervisor.name, request.supervisor_name
  end

  # Author: Terry Thompson
  # 6/30/2025
  test "submitted by name equals employee name that matches submitted_by_id" do
    request = time_off_requests(:one)
    employee = employees(:one)
    request.submitted_by_id = employee.id
    assert_equal employee.name, request.submitted_by_name
  end
end
