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
end
