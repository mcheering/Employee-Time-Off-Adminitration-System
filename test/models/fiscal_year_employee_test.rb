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

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "years of service should equal 0 for employee hired during fiscal year" do
    employee = Employee.new(hire_date: "2025-02-01")
    fiscal_year = FiscalYear.new(start_date: "2025-01-01", end_date: "2025-12-31")
    fiscal_year_employee = FiscalYearEmployee.create(employee: employee, fiscal_year: fiscal_year)
    assert_equal 0, fiscal_year_employee.years_of_service
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "years of service should equal 0 for employee hired six months before the fiscal year start" do
    employee = Employee.new(hire_date: "2024-07-01")
    fiscal_year = FiscalYear.new(start_date: "2025-01-01", end_date: "2025-12-31")
    fiscal_year_employee = FiscalYearEmployee.create(employee: employee, fiscal_year: fiscal_year)
    assert_equal 0, fiscal_year_employee.years_of_service
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "years of service should equal 1 for employee hired more than six months before the fiscal year start" do
    employee = Employee.new(hire_date: "2024-06-01")
    fiscal_year = FiscalYear.new(start_date: "2025-01-01", end_date: "2025-12-31")
    fiscal_year_employee = FiscalYearEmployee.create(employee: employee, fiscal_year: fiscal_year)
    assert_equal 1, fiscal_year_employee.years_of_service
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "years of service should equal 5 for employee hired five years six months before fiscal year start date" do
    employee = Employee.new(hire_date: "2019-07-01")
    fiscal_year = FiscalYear.new(start_date: "2025-01-01", end_date: "2025-12-31")
    fiscal_year_employee = FiscalYearEmployee.create(employee: employee, fiscal_year: fiscal_year)
    assert_equal 5, fiscal_year_employee.years_of_service
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "years of service should equal 6 for employee hired more than six years six months before fiscal year start date" do
     employee = Employee.new(hire_date: "2019-06-30")
    fiscal_year = FiscalYear.new(start_date: "2025-01-01", end_date: "2025-12-31")
    fiscal_year_employee = FiscalYearEmployee.create(employee: employee, fiscal_year: fiscal_year)
    assert_equal 6, fiscal_year_employee.years_of_service
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "allotted PTO equals 9 for employee hired before fiscal year start date" do
    employee = Employee.new(hire_date: "2024-12-31")
    fiscal_year = FiscalYear.new(start_date: "2025-01-01", end_date: "2025-12-31")
    fiscal_year_employee = FiscalYearEmployee.create(employee: employee, fiscal_year: fiscal_year)
    assert_equal 9, fiscal_year_employee.allotted_pto_days
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "allotted PTO equals 8.5 for employee hired on January 31" do
    employee = Employee.new(hire_date: "2025-01-31")
    fiscal_year = FiscalYear.new(start_date: "2025-01-01", end_date: "2025-12-31")
    fiscal_year_employee = FiscalYearEmployee.create(employee: employee, fiscal_year: fiscal_year)
    assert_equal 8.5, fiscal_year_employee.allotted_pto_days
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "allotted PTO equals 0 for employee hired on December 31" do
    employee = Employee.new(hire_date: "2025-12-31")
    fiscal_year = FiscalYear.new(start_date: "2025-01-01", end_date: "2025-12-31")
    fiscal_year_employee = FiscalYearEmployee.create(employee: employee, fiscal_year: fiscal_year)
    assert_equal 0, fiscal_year_employee.allotted_pto_days
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "allotted PTO equals 4.5 for employee hired during sixth month of the the fiscal year" do
    employee = Employee.new(hire_date: "2025-06-30")
    fiscal_year = FiscalYear.new(start_date: "2025-01-01", end_date: "2025-12-31")
    fiscal_year_employee = FiscalYearEmployee.create(employee: employee, fiscal_year: fiscal_year)
    assert_equal 4.5, fiscal_year_employee.allotted_pto_days
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  test "earned vacation days should equal 0 for employee with 0 years of service" do
    employee = Employee.new(hire_date: "2025-02-01")
    fiscal_year = FiscalYear.new(start_date: "2025-01-01", end_date: "2025-12-31")
    fiscal_year_employee = FiscalYearEmployee.create(employee: employee, fiscal_year: fiscal_year)
    assert_equal 0, fiscal_year_employee.earned_vacation_days
  end
end
