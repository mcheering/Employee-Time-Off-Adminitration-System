require "test_helper"

class AdministratorsControllerTest < ActionController::TestCase
  # Author: William Pevytoe
  # Date: 6/18/2025
  # Admin dashboard action successfully loads all employees, fiscal years, and computes the fiscal-year-employee data for display
  include Devise::Test::ControllerHelpers

  setup do
    @admin = employees(:administrator)
    sign_in @admin

    @employee1 = employees(:one)
    @employee2 = employees(:two)
    @fiscal_year   = fiscal_years(:one)

    @fiscal_year1 = fiscal_year_employees(:one)
    @fiscal_year2 = fiscal_year_employees(:two)
  end

  # Author: William Pevytoe
  # Date: 6/18/2025
  test "dashboard assigns @employees, @fiscal_years and @fiscal_year_employees" do
    get :dashboard
    assert_response :success

    all_employees = assigns(:employees)
    assert_includes all_employees, @admin
    assert_includes all_employees, @employee1
    assert_includes employees, @employee2

    fiscal_years_assigned = assigns(:fiscal_years)
    assert_equal FiscalYear.all.to_a, fiscal_years_assigned

    fiscal_year_employees = assigns(:fiscal_year_employees)
    assert_kind_of Array, fiscal_year_employees
    assert_equal 3, fiscal_year_employees.size

    record = fiscal_year_employees.find { |h| h[:employee_id] == @employee1.id }
    assert record, "expected a record for employee ##{@employee1.id}"
    assert_equal @employee1.name, record[:employee_name]
    assert_equal @fiscal_year.id, record[:fiscal_year_id]
  end
end
