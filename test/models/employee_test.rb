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

  test "hire date before termination date" do
    employee = Employee.new(
      first_name: "John",
      last_name: "Doe",
      hire_date: "2025-01-01",
      termination_date: "2024-01-01",
      is_administrator: false,
      is_supervisor: false,
      email: "john.doe@example.com",
      password: "password123",
      password_confirmation: "password123"
    )
    assert employee.invalid?
    assert_includes employee.errors[:termination_date], "must be before termination date"
  end
end
