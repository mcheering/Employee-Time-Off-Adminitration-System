# test/controllers/fiscal_years_controller_test.rb
require "test_helper"

class FiscalYearsControllerTest < ActionDispatch::IntegrationTest
  # Author: William Pevytoe
  # Date: 6/18/2025
  #Testing methods for Fiscal Year (create, update)
  fixtures :fiscal_years

  # Author: William Pevytoe
  # Date: 6/18/2025
  test "should create a brand-new fiscal year" do
    assert_difference("FiscalYear.count", 1) do
      post fiscal_years_url,
           params: {
             fiscal_year: {
               start_date: "2026-01-01",
               end_date:   "2026-12-31"
             }
           },
           as: :json
    end

    assert_response :created
    json = JSON.parse(response.body)
    assert_equal "2026", json["caption"]
  end

  # Author: William Pevytoe
  # Date: 6/18/2025
  test "should not create overlapping fiscal year" do
    existing = fiscal_years(:one)

    assert_no_difference("FiscalYear.count") do
      post fiscal_years_url,
           params: {
             fiscal_year: {
               start_date: existing.start_date.to_s,
               end_date:   existing.end_date.to_s
             }
           },
           as: :json
    end

    assert_response :unprocessable_entity
    errors = JSON.parse(response.body)
    assert_includes errors["start_date"], "overlaps with an existing fiscal year"
  end

  # Author: William Pevytoe
  # Date: 6/18/2025
  test "should update an existing fiscal year" do
    fiscal_year = fiscal_years(:one)

    patch fiscal_year_url(fiscal_year),
          params: {
            fiscal_year: { end_date: "2024-11-30" }
          },
          as: :json

    assert_response :ok
    json = JSON.parse(response.body)
    assert_equal "2024", json["caption"]

    fiscal_year.reload
    assert_equal Date.new(2024, 11, 30), fiscal_year.end_date
  end

  # Author: William Pevytoe
  # Date: 6/18/2025
  test "should not update with invalid date order" do
    fiscal_year = fiscal_years(:one)

    patch fiscal_year_url(fiscal_year),
          params: {
            fiscal_year: { start_date: fiscal_year.end_date + 1.day }
          },
          as: :json

    assert_response :unprocessable_entity
    errors = JSON.parse(response.body)
    assert_includes errors["start_date"], "must be before end date"
  end
end
