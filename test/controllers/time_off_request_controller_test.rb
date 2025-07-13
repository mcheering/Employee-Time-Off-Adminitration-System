require "test_helper"

time_off_ctrl = TimeOffRequestsController rescue nil
if time_off_ctrl
  class TimeOffRequestsController
    def authorize_self_or_admin!(*); end
    def authorize_admin!(*); end
    def authorize_supervisor_of!(*); end
    def authorize_supervisor_or_admin!(*); end
  end
end

class ApplicationController
  def authorize_self!(*); end
  def authorize_admin!(*); end
  def authorize_supervisor_of!(*); end
  def authorize_supervisor_or_admin!(*); end
end

class TimeOffRequestsControllerTest < ActionDispatch::IntegrationTest
  # Author: William Pevytoe
  # Date:   7/4/2025
  # Testing methods for TimeOffRequestsController

  setup do
    @employee         = employees(:one)
    @supervisor       = employees(:supervisor)
    @fiscal_year      = fiscal_years(:two)
    @fye              = FiscalYearEmployee.create!(employee: @employee, fiscal_year: @fiscal_year)

    @time_off_request = TimeOffRequest.create!(
      fiscal_year_employee: @fye,
      supervisor:           @supervisor,
      submitted_by_id:      @employee.id,
      request_date:         Date.current,
      reason:               :pto
    )
    @date = @time_off_request.dates.create!(date: Date.current, amount: 1.0)
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "should get new" do
    get new_employee_time_off_request_path(@employee, fiscal_year_id: @fye.fiscal_year.id)
    assert_response :success

    fye_assigned = assigns(:fiscal_year_employee)
    assert_equal @employee.id,    fye_assigned.employee_id
    assert_equal @fiscal_year.id, fye_assigned.fiscal_year_id
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "new redirects when no fiscal_year_employee" do
    FiscalYearEmployee.where(employee: @employee).delete_all

    get new_employee_time_off_request_path(@employee)
    assert_redirected_to employee_path(@employee)
    assert_equal "No fiscal year employee record found for this employee.", flash[:alert]
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "should create time off request" do
    assert_difference("TimeOffRequest.count", 1) do
      post employee_time_off_requests_path(@employee), params: {
        time_off_request: {
          reason:                   :pto,
          is_fmla:                  false,
          comment:                  "Test",
          fiscal_year_employee_id:  @fye.id,
          supervisor_id:            @supervisor.id,
          submitted_by_id:          @employee.id,
          days: [ { date: Date.tomorrow.to_s, amount: 1.0 } ]
        }
      }
    end
    assert_redirected_to employee_path(@employee)
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "create invalid params" do
    assert_no_difference("TimeOffRequest.count") do
      post employee_time_off_requests_path(@employee),
           params: { time_off_request: { reason: nil } },
           as: :json
    end
    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert body["errors"].any?
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "create success" do
    post employee_time_off_requests_path(@employee),
         params: {
           time_off_request: {
             reason:                  "pto",
             is_fmla:                 false,
             comment:                 "OK",
             fiscal_year_employee_id: @fye.id,
             supervisor_id:           @supervisor.id,
             submitted_by_id:         @employee.id,
             days: [ { date: Date.tomorrow.to_s, amount: 1.0 } ]
           }
         },
         as: :json

    assert_response :created
    body = JSON.parse(response.body)
    assert body["success"]
    assert_equal "pto", body["request"]["reason"]
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "should show time off request" do
    get employee_time_off_request_path(@employee, @time_off_request)
    assert_response :success
    assert assigns(:decision_breakdown)
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "show JSON format" do
    get employee_time_off_request_path(@employee, @time_off_request), as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_includes body.keys, "decision_breakdown"
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "should get edit" do
    get edit_employee_time_off_request_path(@employee, @time_off_request)
    assert_response :success
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "should update time off request (HTML)" do
    patch employee_time_off_request_path(@employee, @time_off_request),
          params: { time_off_request: { reason: :vacation, days: [ { date: Date.today.to_s, amount: 0.5 } ] } }

    assert_redirected_to employee_path(@employee)
    @time_off_request.reload
    assert_equal "vacation", @time_off_request.reason
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "update invalid params (JSON)" do
    patch employee_time_off_request_path(@employee, @time_off_request),
          params: { time_off_request: { reason: nil } },
          as: :json

    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert body["errors"].any?
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "update success JSON" do
    patch employee_time_off_request_path(@employee, @time_off_request),
          params: { time_off_request: { reason: "vacation", days: [ { date: Date.tomorrow.to_s, amount: 2.0 } ] } },
          as: :json

    assert_response :ok
    body = JSON.parse(response.body)
    assert body["success"]
    assert_equal "vacation", body["request"]["reason"]
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "should handle supervisor decision approve" do
    patch supervisor_decision_supervisor_time_off_request_path(@supervisor, @time_off_request),
          params: { decision: "approve" }

    assert_response :success
    @time_off_request.dates.each { |d| assert_equal "approved", d.reload.decision }
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "supervisor_decision deny" do
    patch supervisor_decision_supervisor_time_off_request_path(@supervisor, @time_off_request),
          params: { decision: "deny" }

    assert_response :success
    @time_off_request.dates.each { |d| assert_equal "denied", d.reload.decision }
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "supervisor_decision more_info" do
    patch supervisor_decision_supervisor_time_off_request_path(@supervisor, @time_off_request),
          params: { decision: "more_info" }

    assert_response :success
    assert_not_nil @time_off_request.reload.additional_information_date
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "supervisor_decision invalid" do
    patch supervisor_decision_supervisor_time_off_request_path(@supervisor, @time_off_request),
          params: { decision: "oops" }

    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert_equal "Invalid decision type", body["error"]
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "should update date decision" do
    patch update_date_supervisor_time_off_request_path(@supervisor, @time_off_request, @date.id),
          params: { decision: "denied" }

    assert_response :success
    assert_equal "denied", @date.reload.decision
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "update_date invalid decision" do
    patch update_date_supervisor_time_off_request_path(@supervisor, @time_off_request, @date.id),
          params: { decision: "nope" }

    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert_includes body["error"], "Invalid decision"
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "should update all dates decisions" do
    patch update_all_supervisor_time_off_request_path(@supervisor, @time_off_request),
          params: { decision: "approved" }

    assert_response :success
    @time_off_request.dates.each { |d| assert_equal "approved", d.reload.decision }
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "update_all invalid decision" do
    patch update_all_supervisor_time_off_request_path(@supervisor, @time_off_request),
          params: { decision: "nah" }

    assert_response :no_content
    @time_off_request.reload.dates.each do |d|
      assert_equal "denied", d.decision
    end
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "manage action for supervisor" do
    get manage_supervisor_time_off_request_path(@supervisor, @time_off_request)

    assert_response :success
    assert_equal @supervisor.id,        assigns(:supervisor).id
    assert_equal @time_off_request.id,  assigns(:request).id
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "create redirects HTML when fiscal_year_employee invalid" do
    post employee_time_off_requests_path(@employee),
         params: { time_off_request: { fiscal_year_employee_id: 0, days: [ { date: Date.tomorrow.to_s, amount: 1.0 } ] } }

    assert_redirected_to employee_path(@employee)
    assert_equal "Invalid fiscal year selected.", flash[:alert]
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "create returns JSON 422 when fiscal_year_employee invalid" do
    post employee_time_off_requests_path(@employee),
         params: { time_off_request: { fiscal_year_employee_id: 0, days: [ { date: Date.tomorrow.to_s, amount: 1.0 } ] } },
         as: :json

    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert_includes body["errors"], "Invalid fiscal year selected."
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "update invalid params through JSON returns errors" do
    patch employee_time_off_request_path(@employee, @time_off_request),
          params: { time_off_request: { reason: nil, days: [] } },
          as: :json

    assert_response :unprocessable_entity
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "update_date_rejects waiting_information as invalid enum" do
    assert_raises ArgumentError do
      patch update_date_supervisor_time_off_request_path(@supervisor, @time_off_request, @date.id),
            params: { decision: "waiting_information" }, as: :json
    end
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "admin manage page loads" do
    @time_off_request.update!(
      supervisor_decision_date: 1.day.ago,
      request_status:         :supervisor_reviewed,
      final_decision:         :undecided
    )

    get manage_administrators_time_off_request_path(@time_off_request.id)
    assert_response :success
    assert_equal @time_off_request.id, assigns(:request).id
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "admin bulk approve (update_all) returns no_content and sets all dates" do
    patch update_final_all_administrators_time_off_request_path(@time_off_request.id),
          params: { decision: "approved" },
          as: :json

    assert_response :no_content
    @time_off_request.reload
    @time_off_request.dates.each { |d| assert_equal "approved", d.decision }
    assert_equal "decided",  @time_off_request.request_status
    assert_equal "approved", @time_off_request.final_decision
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "admin bulk deny (update_all) with non-approved decision still works" do
    patch update_final_all_administrators_time_off_request_path(@time_off_request.id),
          params: { decision: "nah" },
          as: :json

    assert_response :no_content
    @time_off_request.reload
    @time_off_request.dates.each { |d| assert_equal "denied", d.decision }
    assert_equal "decided", @time_off_request.request_status
    assert_equal "denied",  @time_off_request.final_decision
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "admin can update single date and finalize on update_date" do
    @time_off_request.update!(
      supervisor_decision_date: 1.day.ago,
      final_decision:         :undecided
    )

    patch update_final_date_administrators_time_off_request_path(@time_off_request.id, @date.id),
          params: { decision: "approved", role: "admin" },
          as: :json

    assert_response :success
    assert_equal "approved", @date.reload.decision

    req = @time_off_request.reload
    assert_not_nil req.final_decision_date
    assert_equal "approved", req.final_decision
    assert_equal "decided",  req.request_status
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "model status_caption branches" do
    @time_off_request.update!(request_status: :pending, final_decision: :undecided)
    assert_equal "Pending", @time_off_request.status_caption

    @time_off_request.update!(request_status: :waiting_information)
    assert_equal "Waiting for more information", @time_off_request.status_caption

    @time_off_request.update!(request_status: :supervisor_reviewed)
    assert_equal "Reviewed by supervisor", @time_off_request.status_caption

    @time_off_request.update!(request_status: :decided, final_decision: :approved)
    assert_equal "Final decision made: Approved by Admin", @time_off_request.status_caption
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "model final_decision_caption enum mapping" do
    @time_off_request.final_decision = :approved
    assert_equal "Approved by Admin", @time_off_request.final_decision_caption

    @time_off_request.final_decision = :denied
    assert_equal "Denied by Admin", @time_off_request.final_decision_caption

    @time_off_request.final_decision = :undecided
    assert_equal "Not yet decided", @time_off_request.final_decision_caption
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "model ready_for_final_decision? logic" do
    @time_off_request.update!(request_status: :supervisor_reviewed, final_decision: :undecided)
    assert @time_off_request.ready_for_final_decision?

    @time_off_request.final_decision = :approved
    refute @time_off_request.ready_for_final_decision?
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "model update_status! covers all branches" do
    @time_off_request.dates.destroy_all
    @time_off_request.dates.create!(date: Date.today,    amount: 1.0, decision: :pending)
    @time_off_request.dates.create!(date: Date.tomorrow, amount: 1.0, decision: :approved)
    @time_off_request.update_status!
    assert_equal "pending",   @time_off_request.request_status
    assert_equal "undecided", @time_off_request.final_decision

    @time_off_request.dates.destroy_all
    @time_off_request.dates.create!(date: Date.today, amount: 1.0, decision: :denied)
    @time_off_request.update_status!
    assert_equal "decided", @time_off_request.request_status
    assert_equal "denied",  @time_off_request.final_decision

    @time_off_request.dates.destroy_all
    2.times { @time_off_request.dates.create!(date: Date.today, amount: 1.0, decision: :approved) }
    @time_off_request.update_status!
    assert_equal "decided",  @time_off_request.request_status
    assert_equal "approved", @time_off_request.final_decision

    @time_off_request.dates.destroy_all
    @time_off_request.dates.create!(date: Date.today,    amount: 1.0, decision: :approved)
    @time_off_request.dates.create!(date: Date.tomorrow, amount: 1.0, decision: :denied)
    @time_off_request.update_status!
    assert_equal "decided", @time_off_request.request_status
    assert_equal "denied",  @time_off_request.final_decision
  end

  # Author: William Pevytoe
  # Date:   7/4/2025
  test "model requested_dates_within_fiscal_year validation" do
    @time_off_request.dates.destroy_all
    @time_off_request.dates.create!(
      date: @fiscal_year.start_date - 1.day,
      amount: 1.0
    )
    refute @time_off_request.valid?
    assert_match /outside of fiscal year/, @time_off_request.errors[:base].first
  end
end
