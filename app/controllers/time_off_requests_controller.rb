# Author: Matthew Heering
# Description:  Handles data related to time off requests for CRUD application
# Date: 7/2/25

class TimeOffRequestsController < ApplicationController
  before_action :set_employee, if: -> { params[:employee_id].present? }
  before_action :set_request, only: [ :show, :edit, :update, :manage, :supervisor_decision, :update_date, :update_all ]

  before_action only: [ :new, :create, :edit, :update, :show ] do
    authorize_self!(@employee) if @employee
  end

  before_action only: [ :manage, :supervisor_decision, :update_date, :update_all ] do
    if params[:supervisor_id]
      employee = @request.fiscal_year_employee.employee
      authorize_supervisor_of!(employee)
    else
      authorize_admin!
    end
  end

  def new
    @request = TimeOffRequest.new
    @fiscal_years = FiscalYear.all

    fiscal_year_id = params[:fiscal_year_id] || @fiscal_years.order(start_date: :desc).first&.id
    @fiscal_year_employee = FiscalYearEmployee.find_by(employee: @employee, fiscal_year_id: fiscal_year_id)

    if @fiscal_year_employee.nil?
      flash[:alert] = "No fiscal year employee record found for this employee."
      return redirect_to employee_path(@employee)
    end

    @request.fiscal_year_employee_id = @fiscal_year_employee.id
    @request.supervisor_id = @employee.supervisor_id

    render "form"
  end

  def create
    permitted = request_params
    days = permitted[:days]
    request_data = permitted.except(:days)

    # Fetch fiscal year employee
    @fiscal_year_employee = FiscalYearEmployee.find_by(id: request_data[:fiscal_year_employee_id], employee: @employee)

    if @fiscal_year_employee.nil?
      respond_to do |format|
        format.html { redirect_to employee_path(@employee), alert: "Invalid fiscal year selected." }
        format.json { render json: { errors: [ "Invalid fiscal year selected." ] }, status: :unprocessable_entity }
      end
      return
    end

    request_data[:fiscal_year_employee_id] = @fiscal_year_employee.id
    request_data[:reason] = request_data[:reason].to_sym if request_data[:reason].is_a?(String)
    request_data[:request_date] = days.first[:date] if days.present?
    request_data[:supervisor_id] ||= @employee.supervisor_id || Employee.where(is_supervisor: true).sample.id

    @request = TimeOffRequest.new(request_data)

    if @request.save
      (days || []).each do |day|
        @request.dates.create(date: day[:date], amount: day[:amount])
      end

      respond_to do |format|
        format.html { redirect_to employee_path(@employee), notice: "Time off request created." }
        format.json { render json: { success: true, request: @request }, status: :created }
      end
    else
      respond_to do |format|
        format.html { render :form, status: :unprocessable_entity }
        format.json { render json: { errors: @request.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end


  def show
    counts = @request.dates.group(:decision).count

    breakdown = {
      "pending" => 0,
      "approved" => 0,
      "denied" => 0
    }

    counts.each do |key, count|
      status = TimeOff.decisions.key(key) # convert integer to string
      breakdown[status] = count if breakdown.key?(status)
    end

    respond_to do |format|
      format.html do
        @decision_breakdown = breakdown
        render :show
      end
      format.json do
        render json: { request: @request, decision_breakdown: breakdown }
      end
    end
  end

  def edit
@fiscal_years = @employee
.fiscal_year_employees
.includes(:fiscal_year)
.map(&:fiscal_year)

    @fiscal_year_employee = @request.fiscal_year_employee
    render :form, layout: true
  end

  def update
    permitted = request_params
    days = permitted[:days]
    request_data = permitted.except(:days)

    request_data[:reason] = request_data[:reason].to_sym if request_data[:reason].is_a?(String)
    request_data[:request_date] = days.first[:date] if days.present?
    request_data[:supervisor_id] ||= @request.supervisor_id || @employee.supervisor_id || Employee.where(is_supervisor: true).sample.id

    if @request.update(request_data)
      @request.dates.destroy_all
      (days || []).each do |day|
        @request.dates.create(date: day[:date], amount: day[:amount])
      end

      respond_to do |format|
        format.html { redirect_to employee_path(@employee) }
        format.json { render json: { success: true, request: @request }, status: :ok }
      end
    else
      respond_to do |format|
        format.html { render :form, status: :unprocessable_entity }
        format.json { render json: { errors: @request.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def manage
    @request = TimeOffRequest.find(params[:id])

    if params[:supervisor_id].present?
      @role = "supervisor"
      @supervisor = Employee.find(params[:supervisor_id])
      @redirect_path = supervisor_path(@supervisor)
    else
      @role = "admin"
      @supervisor = @request.supervisor
      @redirect_path = admin_dashboard_path
    end
  end

  def supervisor_decision
    @request.update!(supervisor_decision_date: Time.current)
    decision_type = params[:decision]

    case decision_type
    when "approve"
      @request.dates.update_all(decision: "approved")
    when "deny"
      @request.dates.update_all(decision: "denied")
    when "more_info"
      @request.update!(additional_information_date: Time.current)
    else
      return render json: { error: "Invalid decision type" }, status: :unprocessable_entity
    end

    render json: { success: true, status: @request.status }
  end

  def update_date
    date = @request.dates.find(params[:date_id])
    decision = params[:decision]
    role = (params[:role] || "supervisor").downcase

    unless %w[pending approved denied waiting_information].include?(decision)
      return render json: { error: "Invalid decision" }, status: :unprocessable_entity
    end

    if date.update(decision: decision)
      if role == "admin"
        @request.update!(
          final_decision_date: Time.current,
          final_decision: decision,
          request_status: "decided"
        )
        @request.dates.find(params[:date_id]).update!(decision: decision)
      else
        if @request.dates.where(decision: "pending").none? && @request.supervisor_decision_date.blank?
          @request.update!(supervisor_decision_date: Time.current)
        end
      end

      @request.update_status!

      render json: { success: true, date: date }
    else
      render json: { error: date.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update_all
    authorize_admin!
    decision_enum = params[:decision] == "approved" ? :approved : :denied
    @request.finalize!(decision: decision_enum)

    head :no_content
  end

  private

  def set_employee
    @employee = Employee.find(params[:employee_id])
  end

  def set_request
    @request = TimeOffRequest.find(params[:id])
  end

  def request_params
    params.require(:time_off_request).permit(
      :reason,
      :is_fmla,
      :comment,
      :fiscal_year_employee_id,
      :supervisor_id,
      :submitted_by_id,
      days: [ :date, :amount ]
    )
  end

  def authorize_self_or_admin!(employee)
    unless current_employee.is_administrator? || current_employee.id == employee.id
      redirect_to root_path, alert: "Access denied."
    end
  end

  def authorize_admin!
    unless current_employee.is_administrator?
      redirect_to root_path, alert: "Administrator access required."
    end
  end

  def authorize_supervisor_or_admin!(employee)
    if current_employee.is_administrator?
      return true
    end

    unless current_employee.is_supervisor? && employee.supervisor_id == current_employee.id
      redirect_to root_path, alert: "Supervisor access required."
    end
  end
end
