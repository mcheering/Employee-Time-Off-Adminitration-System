require "test_helper"

class TimeOffRequestTest < ActiveSupport::TestCase
  # Author: Terry Thompson
  # 6/27/2025
  test "should create time_off_request with valid data" do
    request = TimeOffRequest.new
    assert request.invalid?
    assert request.errors[:fiscal_year_employee].any?
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

  # Author: Terry Thompson
  # 6/30/2025
  test "from_date equals 1/5/2025" do
    request = time_off_requests(:one)
    first_date = time_offs(:one) # This record as a date of 1/5/2025
    assert_equal first_date.date, request.from_date
  end

  # Author: Terry Thompson
  # 6/30/2025
  test "from_date equals 1/6/2025" do
    request = time_off_requests(:one)
    last_date = time_offs(:two) # This record as a date of 1/5/2025
    assert_equal last_date.date, request.to_date
  end

  # Author: Terry Thompson
  # 6/30/2025
  test "status equals decided when final_decision_date has a value" do
    request = TimeOffRequest.new(final_decision_date: "2015-01-01")
    assert_equal "decided", request.status
  end

  # Author: Terry Thompson
  # 6/30/2025
  test "status equals information needed when additional_information_date has a value" do
    request = TimeOffRequest.new(additional_information_date: "2025-01-01")
    assert_equal "information needed", request.status
  end

  # Author: Terry Thompson
  # 6/30/2025
  test "status equals supervisor reviewed when supervisor_decision_date and additional_information_date have values and information_received_date does not" do
    request = TimeOffRequest.new(
        additional_information_date: "2025-01-01", supervisor_decision_date: "2025-01-02")
    assert_equal "information needed", request.status
  end

  # Author: Terry Thompson
  # 6/30/2025
  test "status equals supervisor reviewed when supervisor_decision_date and additional_information_date and information_received_date" do
    request = TimeOffRequest.new(additional_information_date: "2025-01-01", supervisor_decision_date: "2025-01-02", information_received_date: "2025-01-02")
    assert_equal "supervisor reviewed", request.status
  end

  # Author: Terry Thompson
  # 6/30/2025
  test "status equals supervisor reviewed when supervisor_decision_date has a value" do
    request = TimeOffRequest.new(supervisor_decision_date: "2025-01-01")
    assert_equal "supervisor reviewed", request.status
  end

  # Author: Terry Thompson
  # 6/30/2025
  test "status equals pending when requested date has a value" do
    request = TimeOffRequest.new()
    assert_equal "pending", request.status
  end

  # Author: Terry Thompson
  # 7/3/2025
  test "reason caption returns 'bereavement' when reason equals bereavement" do
    request = TimeOffRequest.new(reason: :bereavement)
    assert_equal "bereavement", request.reason_caption
  end

  # Author: Terry Thompson
  # 7/3/2025
  test "reason caption returns 'jury duty' when reason equals jury_duty" do
    request = TimeOffRequest.new(reason: :jury_duty)
    assert_equal "jury duty", request.reason_caption
  end

  # Author: Terry Thompson
  # 7/3/2025
  test "reason caption returns 'pto' when reason equals pto" do
    request = TimeOffRequest.new(reason: :pto)
    assert_equal "pto", request.reason_caption
  end

  # Author: Terry Thompson
  # 7/3/2025
  test "reason caption returns 'other' when reason equals other" do
    request = TimeOffRequest.new(reason: :other)
    assert_equal "other", request.reason_caption
  end

  # Author: Terry Thompson
  # 7/3/2025
  test "reason caption returns 'unpaid' when reason equals unpaid" do
    request = TimeOffRequest.new(reason: :unpaid)
    assert_equal "unpaid", request.reason_caption
  end

  # Author: Terry Thompson
  # 7/3/2025
  test "reason caption returns 'vacation' when reason equals vacation" do
    request = TimeOffRequest.new(reason: :vacation)
    assert_equal "vacation", request.reason_caption
  end
end
