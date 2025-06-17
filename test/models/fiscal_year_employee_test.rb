require "test_helper"

class FiscalYearEmployeeTest < ActiveSupport::TestCase
  # Author: Terry Thompson
  # Date: 6/18/2025
  test "fiscal year employee should be valid with all required attributes" do
    fiscal_year_employee = FiscalYearEmployee.new
    assert fiscal_year_employee.invalid?
    assert_includes fiscal_year_employee.errors[:fiscal_year_id], "can't be blank"
    assert_includes fiscal_year_employee.errors[:employee_id], "can't be blank"
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "fiscal year employee name should match employee name" do
    employee = employees(:one)
    fiscal_year = fiscal_years(:one)
    fiscal_year_employee = FiscalYearEmployee.create(employee: employee, fiscal_year: fiscal_year)

    assert_equal employee.name, fiscal_year_employee.employee_name
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "fiscal year caption should match fiscal year caption" do
    employee = employees(:one)
    fiscal_year = fiscal_years(:one)
    fiscal_year_employee = FiscalYearEmployee.create(employee: employee, fiscal_year: fiscal_year)

    assert_equal fiscal_year.caption, fiscal_year_employee.fiscal_year_caption
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "fiscal year employee hire date should match employee hire date" do
    employee = employees(:one)
    fiscal_year = fiscal_years(:one)
    fiscal_year_employee = FiscalYearEmployee.create(employee: employee, fiscal_year: fiscal_year)

    assert_equal employee.hire_date, fiscal_year_employee.employee_hire_date
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "fiscal year employee termination date should match employee termination date" do
    employee = employees(:one)
    employee.termination_date = employee.hire_date + 1.year
    fiscal_year = fiscal_years(:one)
    fiscal_year_employee = FiscalYearEmployee.create(employee: employee, fiscal_year: fiscal_year)
    assert_equal employee.termination_date, fiscal_year_employee.employee_termination_date
  end
end
