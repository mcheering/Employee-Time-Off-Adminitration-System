require "test_helper"

# Author: Terry Thompson
# Date: 6/16/2025
# Description: Tests for the FiscalYear model.
# This test suite ensures that the FiscalYear model buiness rules are correctly implemented.
class FiscalYearTest < ActiveSupport::TestCase
  # Author: Terry Thompson
  # Date: 6/16/2025
  # Description: Tests that a fiscal year can only be created with valid attributes.
  def test_should_create_fiscal_year_with_valid_attributes
    fiscal_year = FiscalYear.new
    assert fiscal_year.invalid?
    assert fiscal_year.errors[:start_date].any?
    assert fiscal_year.errors[:end_date].any?
    assert fiscal_year.errors[:is_open].none?
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  # Description: Tests that the start_date must be before the end_date
  def test_start_date_before_end_date
    fiscal_year = FiscalYear.new(start_date: Date.today, end_date: Date.yesterday)
    assert fiscal_year.invalid?
    assert_includes fiscal_year.errors[:start_date], "must be before end date"
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  # Description: Tests that is_open defaults to true for new fiscal years
  def test_fiscal_year_is_open_default_is_true
    fiscal_year = FiscalYear.new(start_date: Date.today, end_date: Date.tomorrow)
    assert fiscal_year.is_open?
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  # Description: Tests that caption returns a single year when the company uses a calendar year for its fiscal year
  def test_caption_is_correct_for_same_year
    fiscal_year = FiscalYear.new(start_date: Date.new(2024, 1, 1), end_date: Date.new(2024, 12, 31))
    assert_equal "2024", fiscal_year.caption
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  # Description: Tests that caption returns a string in the format "YYYY-YY" when the fiscal year spans two years
  def test_caption_is_correct_for_different_years
    fiscal_year = FiscalYear.new(start_date: Date.new(2024, 7, 1), end_date: Date.new(2025, 06, 30))
    assert_equal "2024-25", fiscal_year.caption
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  # Description: Tests that status returns "open" when is_open is true
  def test_status_returns_open_when_is_open_true
    fiscal_year = FiscalYear.new
    assert_equal "open", fiscal_year.status
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  # Description: Tests that status returns "closed" when is_open is false
  def test_status_returns_closed_when_is_open_false
    fiscal_year = FiscalYear.new
    fiscal_year.is_open = false
    assert_equal "closed", fiscal_year.status
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  # Description: Tests that start_date does not not fall in the middle of an existing fiscal year
  def test_start_date_does_not_overlap_with_existing_fiscal_years
    existing_fiscal_year = FiscalYear.create!(start_date: Date.new(2024, 1, 1), end_date: Date.new(2024, 12, 31))
    new_fiscal_year = FiscalYear.new(start_date: Date.new(2024, 6, 1), end_date: Date.new(2025, 6, 30))

    assert new_fiscal_year.invalid?
    assert_includes new_fiscal_year.errors[:start_date], "overlaps with an existing fiscal year"

    # Clean up
    existing_fiscal_year.destroy
  end

  # Author: Terry Thompson
  # Date: 6/16/2025
  # Description: Tests that end_date does not not fall in the middle of an existing fiscal year
  def test_end_date_does_not_overlap_with_existing_fiscal_years
    existing_fiscal_year = FiscalYear.create!(start_date: Date.new(2024, 1, 1), end_date: Date.new(2024, 12, 31))
    new_fiscal_year = FiscalYear.new(start_date: Date.new(2023, 6, 1), end_date: Date.new(2024, 6, 30))

    assert new_fiscal_year.invalid?
    assert_includes new_fiscal_year.errors[:end_date], "overlaps with an existing fiscal year"

    # Clean up
    existing_fiscal_year.destroy
  end
end
