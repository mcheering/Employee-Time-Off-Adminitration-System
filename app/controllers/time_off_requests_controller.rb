#Author: Matthew Heering
#Description:  Handles data relate to time off requests for CRUD application
#Date: 7/2/25
class TimeOffRequestsController < ApplicationController
  before_action :set_employee, if: -> { params[:employee_id].present? }
  before_action :set_request, only: [:show, :edit, :update, :manage, :supervisor_decision]

  def new
    @request = TimeOffRequest.new
    @fiscal_years = FiscalYear.all

    fiscal_year_id = params[:fiscal_year_id] || @fiscal_years.order(start_date: :desc).first&.id
    @fiscal_year_employee = FiscalYearEmployee.find_by(employee: @employee, fiscal_year_id: fiscal_year_id)

    if @fiscal_year_employee.nil?
      flash[:alert] = "No fiscal year employee record found for this employee."
      return redirect_to employee_path(@employee)
    end

    render "form"
  end

  def create
    permitted = request_params
    days = permitted[:days]
    request_data = permitted.except(:days)
  
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
    render :show
  end

  def edit
    @fiscal_years = @employee.fiscal_year_employees.includes(:fiscal_year).map do |fye|
      {
        id: fye.fiscal_year.id,
        year: fye.fiscal_year.start_date.year
      }
    end

    @fiscal_year_employee = @request.fiscal_year_employee
    render :form, layout: true
  end

  def update
    permitted = request_params
    days = permitted[:days]
    request_data = permitted.except(:days)
  
    request_data[:reason] = request_data[:reason].to_sym if request_data[:reason].is_a?(String)
  
    if days.present?
      request_data[:request_date] = days.first[:date]
    else
      request_data[:request_date] ||= @request.request_date
    end
  
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
    @supervisor = Employee.find(params[:supervisor_id])
    @request = TimeOffRequest.includes(:dates).find(params[:id])

    render :manage
  end

  def supervisor_decision
    @request = TimeOffRequest.find(params[:id])
    decision_type = params[:decision]
  
    @request.update!(supervisor_decision_date: Time.current)
  
    case decision_type
    when "approve"
      @request.dates.update_all(decision: 1)
    when "deny"
      @request.dates.update_all(decision: 2)
    when "more_info"
      @request.update!(additional_information_date: Time.current)
    else
      return render json: { error: "Invalid decision type" }, status: :unprocessable_entity
    end
  
    render json: { success: true, status: @request.status }
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
      days: [:date, :amount]
    )
  end
end