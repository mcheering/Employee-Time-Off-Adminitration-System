require "test_helper"

class TimeOffRequestTest < ActiveSupport::TestCase
  test "should create time_off_request with valid data" do
    request = TimeOffRequest.new
    assert request.invalid?
    assert request.errors[:fiscal_year_employee].any?
    assert request.errors[:supervisor_id].any?
    assert request.errors[:submitted_by_id].any?
    assert request.errors[:request_date].any?
    assert request.errors[:reason].any?
    # assert request.errors[:is_fmla].any?
  end
end
