require "test_helper"

class TimeOffTest < ActiveSupport::TestCase
  # Author: Terry Thompson
  # Date: 6/30/2025
  test "Time off must contain valid data" do
    time_off = TimeOff.new
    assert time_off.invalid?
    assert time_off.errors[:date].any?
    assert time_off.errors[:request_id].any?
  end

  # Author: Terry Thompson
  # Date: 6/30/2025
  test "decision default value equals pending" do
    time_off = TimeOff.new
    assert_equal "pending", time_off.decision
  end

  # Author: Terry Thompson
  # Date: 6/30/2025
  test "decision_caption equals pending when time_off initally created" do
    time_off = TimeOff.new
    assert_equal "pending", time_off.decision_caption
  end

  # Author: Terry Thompson
  # Date: 6/30/2025
  test "was_taken defaults to true" do
    time_off = TimeOff.new
    assert_equal true, time_off.was_taken
  end

  # Author: Terry Thompson
  # Date: 6/30/2025
  test "decision_caption equals approved when decision is approved" do
    time_off = TimeOff.new(decision: "approved")
    assert_equal "approved", time_off.decision_caption
  end

  # Author: Terry Thompson
  # Date: 6/30/2025
  test "decision_caption equals denied when decision is denied" do
    time_off = TimeOff.new(decision: "denied")
    assert_equal "denied", time_off.decision_caption
  end
end
