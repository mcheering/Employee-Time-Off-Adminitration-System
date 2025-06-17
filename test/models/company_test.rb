require "test_helper"

class CompanyTest < ActiveSupport::TestCase
  test "should create company with valid attributes" do
    company = Company.new
    assert company.invalid?
    assert company.errors[:name].any?
  end
end
