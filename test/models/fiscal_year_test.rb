require "test_helper"

# Author: Terry Thompson
# Date: 6/16/2025
# Description: Tests for the FiscalYear model.
# This test suite ensures that the FiscalYear model buiness rules are correctly implemented.
class FiscalYearTest < ActiveSupport::TestCase
   # Author: Terry Thompson
   # Date: 6/16/2025
   test "test should create fiscal year with valid attributes" do
    fiscal_year = FiscalYear.new
    assert fiscal_year.invalid?
    assert fiscal_year.errors[:start_date].any?
    assert fiscal_year.errors[:end_date].any?
    assert fiscal_year.errors[:is_open].none?
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  test "test start date before end date" do
    fiscal_year = FiscalYear.new(start_date: Date.today, end_date: Date.yesterday)
    assert fiscal_year.invalid?
    assert_includes fiscal_year.errors[:start_date], "must be before end date"
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  test "fiscal year is_open default is true" do
    fiscal_year = FiscalYear.new(start_date: Date.today, end_date: Date.tomorrow)
    assert fiscal_year.is_open?
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  test "caption is correct when fiscal year uses calendar year" do
    fiscal_year = FiscalYear.new(start_date: Date.new(2024, 1, 1), end_date: Date.new(2024, 12, 31))
    assert_equal "2024", fiscal_year.caption
  end

   # Author: Terry Thompson
   # Date: 6/16/2025
   test "caption is correct when fiscal year does not use calendar year" do
    fiscal_year = FiscalYear.new(start_date: Date.new(2024, 7, 1), end_date: Date.new(2025, 06, 30))
    assert_equal "2024-25", fiscal_year.caption
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  test "status returns 'open' when is_open is true" do
    fiscal_year = FiscalYear.new
    assert_equal "open", fiscal_year.status
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  test "status returns 'closed' when is_open is false" do
    fiscal_year = FiscalYear.new
    fiscal_year.is_open = false
    assert_equal "closed", fiscal_year.status
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  test "start_date does is not in the middle of an existing fiscal year" do
    # create a year with a start date that is in :one (in fiscal_years.yml)
    new_fiscal_year = FiscalYear.new(start_date: Date.new(2024, 6, 1), end_date: Date.new(2025, 6, 30))

    assert new_fiscal_year.invalid?
    assert_includes new_fiscal_year.errors[:start_date], "overlaps with an existing fiscal year"
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  test "end_date is not in the middle of an existing fiscal year" do
    # Create a year with an end date that is in :one (in fiscal_years.yml)
    new_fiscal_year = FiscalYear.new(start_date: Date.new(2023, 6, 1), end_date: Date.new(2024, 6, 30))

    assert new_fiscal_year.invalid?
    assert_includes new_fiscal_year.errors[:end_date], "overlaps with an existing fiscal year"
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  test "fiscal year employees are created for existing fiscal years" do
    fiscal_year = FiscalYear.create!(start_date: Date.new(2026, 1, 1), end_date: Date.new(2026, 12, 31))
    assert_equal Employee.count, FiscalYearEmployee.where(fiscal_year: fiscal_year).count
  end
end
