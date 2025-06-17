require "test_helper"

class FiscalYearTest < ActiveSupport::TestCase
  # Test that a fiscal year can only be created with valid attributes
  # This test checks that the fiscal year model requires start_date and end_date to be present
  # and that it is invalid if these attributes are not provided.
  def test_should_create_fiscal_year_with_valid_attributes
    fiscal_year = FiscalYear.new
    assert fiscal_year.invalid?
    assert fiscal_year.errors[:start_date].any?
    assert fiscal_year.errors[:end_date].any?
  end

  # Test that the start_date must be before the end_date
  def test_start_date_before_end_date
    fiscal_year = FiscalYear.new(start_date: Date.today, end_date: Date.yesterday)
    assert fiscal_year.invalid?
    assert_includes fiscal_year.errors[:start_date], "must be before end date"
  end
end
