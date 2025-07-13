require "test_helper"

class AdministratorsControllerTest < ActionController::TestCase
  # Author: William Pevytoe
  # Date: 6/18/2025
  include Devise::Test::ControllerHelpers

  setup do
    @admin       = employees(:administrator)
    sign_in @admin

    @employee1   = employees(:one)
    @employee2   = employees(:two)
    @employee3   = employees(:three)
    @fiscal_year = fiscal_years(:one)

    @fye1        = fiscal_year_employees(:one)
    @fye2        = fiscal_year_employees(:two)
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "dashboard assigns employees array of hashes" do
    get :dashboard
    assert_response :success

    employees_hashes = assigns(:employees)
    ids = employees_hashes.map { |h| h[:id] }
    assert_includes ids, @admin.id
    assert_includes ids, @employee1.id
    assert_includes ids, @employee2.id
    assert_includes ids, @employee3.id
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "dashboard assigns fiscal years as hash list" do
    get :dashboard
    assert_response :success

    fiscal_years_assigned = assigns(:fiscal_years)
    expected = FiscalYear.order(:start_date).map do |fy|
      {
        id: fy.id,
        start_date: fy.start_date,
        end_date: fy.end_date,
        is_open: fy.is_open,
        caption: fy.caption
      }
    end
    assert_equal expected, fiscal_years_assigned
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "dashboard assigns fiscal_year_employees array of hashes" do
    get :dashboard
    assert_response :success

    fye_hashes = assigns(:fiscal_year_employees)
    assert_kind_of Array, fye_hashes
    emp_ids = fye_hashes.map { |h| h[:employee_id] }
    assert_includes emp_ids, @employee1.id
    assert_includes emp_ids, @employee2.id

    record = fye_hashes.find { |h| h[:employee_id] == @employee1.id }
    assert record, "expected a record for employee ##{@employee1.id}"
    assert_equal @employee1.name, record[:employee_name]
    assert_equal @fiscal_year.id, record[:fiscal_year_id]
  end
end
