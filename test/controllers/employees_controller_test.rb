require "test_helper"

class EmployeesControllerTest < ActionDispatch::IntegrationTest
  # Author: William Pevytoe
  # Date: 6/17/2025
  include Devise::Test::IntegrationHelpers

  setup do
    @admin = employees(:administrator)
    @supervisor = employees(:supervisor)
    @employee = Employee.create!(
      first_name: "Test",
      last_name:  "User",
      email:      "test#{SecureRandom.hex(4)}@example.com",
      password:   "Password123!",
      password_confirmation: "Password123!",
      hire_date:  Date.today,
      is_supervisor:    true,
      is_administrator: true
    )
    sign_in @admin
  end
  
  # Author: William Pevytoe
  # Date: 7/10/2025
  test "should get index HTML" do
    get employees_url
    assert_response :success
    assert_select "#employees-react-table"
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "should get index JSON" do
    get employees_url, as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_kind_of Array, body, "Expected root JSON to be an Array"
    body.each do |e|
      assert e.key?("id"),          "JSON employee hash is missing 'id'"
      assert e.key?("first_name"),  "JSON employee hash is missing 'first_name'"
      assert e.key?("last_name"),   "JSON employee hash is missing 'last_name'"
      assert e.key?("email"),       "JSON employee hash is missing 'email'"
    end
  end

  # Author: William Pevytoe
  # Date: 7/10/2025  
  test "should get new" do
    get new_employee_url
    assert_response :success
    assert_not_empty assigns(:supervisors)
  end

  # Author: William Pevytoe
  # Date: 7/10/2025  
  test "should create employee HTML" do
    initial = Employee.count
    post employees_url, params: { employee: {
      first_name: "Jane",
      last_name:  "Doe",
      email:      "jane.doe@example.com",
      password:   "Password123!",
      password_confirmation: "Password123!",
      hire_date:  Date.today,
      is_supervisor:    false,
      is_administrator: false
    }}
    assert_equal initial + 1, Employee.count
    assert_redirected_to employee_path(Employee.last)
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "should not create invalid employee HTML" do
    initial = Employee.count
    post employees_url, params: { employee: { email: "" } }
    assert_equal initial, Employee.count
    assert_response :unprocessable_entity
    assert_select "#new-employee-form"
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "should create employee JSON success" do
    post employees_url, params: { employee: {
      first_name: "Mark",
      last_name:  "Lee",
      email:      "mark.lee@example.com",
      password:   "Password123!",
      password_confirmation: "Password123!",
      hire_date:  Date.today,
      is_supervisor:    false,
      is_administrator: false
    }}, as: :json
    assert_response :created
    body = JSON.parse(response.body)
    assert_equal "Mark", body["first_name"]
  end

  # Author: William Pevytoe
  # Date: 7/10/2025  
  test "should create employee JSON failure" do
    post employees_url, params: { employee: { email: "" } }, as: :json
    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert body.any?
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "should show employee HTML" do
    get employee_url(@employee)
    assert_response :success
    assert assigns(:time_off_payload)
    assert assigns(:summary)
    assert assigns(:fiscal_years)
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "should show employee JSON" do
    get employee_url(@employee), as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert body.key?("time_off_payload")
    assert body.key?("summary")
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "show not found redirects HTML" do
    get employee_url(id: "999999")
    assert_redirected_to employees_url
    assert_equal "Employee not found.", flash[:alert]
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "show not found JSON returns redirect" do
    get employee_url(id: "999999"), as: :json
    assert_response :found
    assert_redirected_to employees_url
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "should get edit" do
    get edit_employee_url(@employee)
    assert_response :success
    assert_not_empty assigns(:supervisors)
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "edit not found redirects" do
    get edit_employee_url(id: "999999")
    assert_redirected_to employees_url
    assert_equal "Employee not found.", flash[:alert]
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "should update employee HTML" do
    patch employee_url(@employee), params: { employee: { last_name: "Smith" } }
    assert_redirected_to employee_path(@employee)
    @employee.reload
    assert_equal "Smith", @employee.last_name
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "should not update invalid employee HTML" do
    original = @employee.last_name
    patch employee_url(@employee), params: { employee: { last_name: "" } }
    assert_response :unprocessable_entity
    @employee.reload
    assert_equal original, @employee.last_name
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "should update employee JSON success" do
    patch employee_url(@employee), params: { employee: { last_name: "Chang" } }, as: :json
    assert_response :ok
    body = JSON.parse(response.body)
    assert_equal "Chang", body["last_name"]
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "should update employee JSON failure" do
    patch employee_url(@employee), params: { employee: { last_name: "" } }, as: :json
    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert body.any?
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "should destroy employee HTML" do
    emp = @employee
    assert_difference("Employee.count", -1) { delete employee_url(emp) }
    assert_redirected_to employees_url
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "should not destroy non-existent HTML" do
    assert_no_difference("Employee.count") { delete employee_url(id: "999999") }
    assert_redirected_to employees_url
    assert_equal "Employee not found.", flash[:alert]
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "should destroy employee JSON" do
    emp = Employee.create!(first_name: "A", last_name: "B", email: "a.b@example.com", password: "P@ssw0rd1", hire_date: Date.today)
    assert_difference("Employee.count", -1) { delete employee_url(emp), as: :json }
    assert_response :no_content
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "show summary empty when no FiscalYearEmployee exists" do
    FiscalYearEmployee.where(employee_id: @employee.id).delete_all
    get employee_url(@employee)
    assert_response :success
    assert_equal({}, assigns(:summary))
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "show summary numeric when a FiscalYearEmployee exists" do
    employee_with_fye = employees(:one)
    get employee_url(employee_with_fye)
    assert_response :success
    summary = assigns(:summary)
    %i[
      earned_vacation_days used_vacation remaining_vacation
      allotted_pto_days    used_pto       remaining_pto
    ].each do |key|
      assert summary.key?(key), "Expected summary to include #{key}"
      assert summary[key].is_a?(Numeric), "#{key} should be numeric"
    end
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "show JSON returns summary with numeric keys" do
    employee_with_fye = employees(:one)
    get employee_url(employee_with_fye), as: :json
    assert_response :success
    body    = JSON.parse(response.body)
    summary = body["summary"]
    %w[
      earned_vacation_days used_vacation remaining_vacation
      allotted_pto_days    used_pto       remaining_pto
    ].each do |key|
      assert summary.key?(key), "Expected JSON summary to include '#{key}'"
      assert summary[key].is_a?(Numeric), "#{key} should be numeric in JSON"
    end
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "destroy non-existent employee JSON returns not_found" do
    missing_id = Employee.last.id + 1
    delete employee_url(missing_id), as: :json
    assert_response :redirect
    assert_redirected_to employees_url
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "show JSON returns empty summary when no FiscalYearEmployee exists" do
    FiscalYearEmployee.where(employee_id: @employee.id).delete_all
    get employee_url(@employee), as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal({}, body["summary"])
  end

  # Author: William Pevytoe
  # Date: 7/10/2025
  test "should populate attention_requests when waiting_information exists" do
    fy  = fiscal_years(:one)
    fye = FiscalYearEmployee.create!(employee: @employee, fiscal_year: fy)
    req = TimeOffRequest.create!(
      fiscal_year_employee: fye,
      submitted_by_id:      @employee.id,
      supervisor_id:        @supervisor.id,
      request_date:         Date.current,
      reason:               :pto
    )

    req.dates.create!(date: Date.current, amount: 1.0, decision: "pending")

    get employee_url(@employee)
    assert_response :success
    arr = assigns(:attention_requests)
    assert_kind_of Array, arr
    assert_empty arr
  end
end
