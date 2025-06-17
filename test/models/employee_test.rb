require "test_helper"

class EmployeeTest < ActiveSupport::TestCase
  # Test that an employee can only ßbe created with valid attributes
  test "should create employee with valid attributes" do
   employee = Employee.new
    assert employee.invalid?
    assert employee.errors[:first_name].any?
    assert employee.errors[:last_name].any?
    assert employee.errors[:hire_date].any?
    assert employee.errors[:is_administrator].any?
    assert employee.errors[:is_supervisor].any?
    assert employee.errors[:email].any?
    assert employee.errors[:password].any?
  end
end
