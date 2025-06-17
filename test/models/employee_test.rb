require "test_helper"

class EmployeeTest < ActiveSupport::TestCase
  # Author: Terry Thompson
  # Date: 6/18/2025
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

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "hire date before termination date should create error" do
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

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "name should return <first_name> <last_name>" do
    employee = employees(:one)
    assert_equal employee.first_name + " " + employee.last_name, employee.name
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "supervisor_name should return supervisor's name when supervisor_id is not nil" do
    employee = employees(:one)
    supervisor = employees(:supervisor)
    employee.supervisor_id = supervisor.id
    assert_equal supervisor.name, employee.supervisor_name
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "supervisor_name should return 'none' when supervisor_id is nil" do
    employee = employees(:one)
    assert_equal "none", employee.supervisor_name
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "email should be unique" do
    existing_employee = employees(:one)
    new_employee = Employee.new(
      first_name: "Jane",
      last_name: "Doe",
      email: existing_employee.email,
      hire_date: "2025-01-01",
      is_administrator: false,
      is_supervisor: false,
      encrypted_password: Devise::Encryptor.digest(User, "password123")
    )
    assert new_employee.invalid?
    assert_includes new_employee.errors[:email], "has already been taken"
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "email must contain '@'" do
    employee = Employee.new(
      first_name: "John",
      last_name: "Doe",
      email: "john.doeexample.com", # Missing '@'
      hire_date: "2025-01-01",
      is_administrator: false,
      is_supervisor: false,
      password: "password123",
      password_confirmation: "password123"
    )
    assert employee.invalid?
    assert_includes employee.errors[:email], "is invalid" # because it does not match URI::MailTo::EMAIL_REGEXP
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "email must have a domain" do
    employee = Employee.new(
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@", # Missing domain
      hire_date: "2025-01-01",
      is_administrator: false,
      is_supervisor: false,
      password: "password123",
      password_confirmation: "password123"
    )
    assert employee.invalid?
    assert_includes employee.errors[:email], "is invalid" # because it does not match URI::MailTo::EMAIL_REGEXP
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "is_supervisor should default to false" do
    employee = Employee.new
    assert_equal employee.is_supervisor, false
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "is_administrator should default to false" do
    employee = Employee.new
    assert_equal employee.is_administrator, false
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "termination_date equals hire_date does not cause an error" do
    employee = employees(:one)
    employee.termination_date = employee.hire_date
    assert employee.errors[:termination_date].empty?
  end
end
