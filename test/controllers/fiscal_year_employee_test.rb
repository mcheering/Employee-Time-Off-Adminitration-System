require "test_helper"

class FiscalYearEmployeeTest < ActiveSupport::TestCase
  # tell Minitest which fixtures to load
  fixtures :employees, :fiscal_years, :fiscal_year_employees

  setup do
    @fiscal_year_employee         = fiscal_year_employees(:one)
    @employee    = employees(:one)
    @employee_2   = employees(:two)
    @fiscal_year = fiscal_years(:one)
  end

  test "fixture records are valid" do
    assert @fiscal_year_employee.valid?
  end

  test "delegates employee_name to employee.name" do
    assert_equal @employee.name, @fiscal_year_employee.employee_name
  end

  test "delegates fiscal_year_caption to fiscal_year.caption" do
    assert_equal @fiscal_year.caption, @fiscal_year_employee.fiscal_year_caption
  end

  test "years_of_service for a fixture hire date" do
    assert_equal 0, @fiscal_year_employee.years_of_service 
  end

  test "earned_vacation_days tiers" do
    assert_equal 0, @fiscal_year_employee.earned_vacation_days
  end

  test "allotted_pto_days for mid‐year hire" do
    mid = fiscal_year_employees(:two)
    days = mid.allotted_pto_days
    assert days.is_a?(Numeric)
  end
end
