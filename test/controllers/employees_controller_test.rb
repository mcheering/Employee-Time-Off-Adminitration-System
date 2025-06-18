require "test_helper"

class EmployeesControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  setup do
    @employee = Employee.create!(
      first_name: "Test",
      last_name: "User",
      email: "test#{SecureRandom.hex(4)}@example.com",
      password: "Password123!",
      password_confirmation: "Password123!",
      hire_date: Date.today
    )

    sign_in @employee,  scope: :employee
  end

  test "should get index" do
    get employees_url
    assert_response :success
      assert_select "#employees-react-table"
  end

  test "should get new" do
    get new_employee_url
    assert_response :success
  end

  test "should create employee" do
    initial_count = Employee.count

    post employees_url, params: {
      employee: {
        email: "test_create@example.com",
        password: "password123",
        password_confirmation: "password123",
        first_name: "Jane",
        last_name: "Doe",
        hire_date: Date.today,
        is_supervisor: false,
        is_administrator: false
      }
    }
    assert_equal initial_count + 1, Employee.count
    assert_redirected_to employee_path(Employee.last)
  end

  test "should show employee" do
    get employee_url(@employee)
    assert_response :success
  end

  test "should get edit" do
    get edit_employee_url(@employee)
    assert_response :success
  end

  test "should update employee" do
    patch employee_url(@employee), params: {
      employee: { last_name: "Updated" }
    }

    assert_redirected_to employee_path(@employee)
    @employee.reload
    assert_equal "Updated", @employee.last_name
  end

  test "should destroy employee" do
    assert_difference("Employee.count", -1) do
      delete employee_url(@employee)
    end

    assert_redirected_to employees_url
  end
end
