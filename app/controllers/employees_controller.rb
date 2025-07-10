# Author: Matthew Heering
# Description: Controls the flow of data from the employees model to the react views.
# Date: 6/18/25
class EmployeesController < ApplicationController
  before_action :set_employee, only: %i[show edit update destroy]
  before_action :authorize_self!, only: %i[show edit update destroy]


  def index
    @employees = Employee.all
  end

  def show
    @employee = Employee.find(params[:id])

    selected_fy_id = params[:fiscal_year_id] || FiscalYear.order(start_date: :desc).first&.id

    fye = FiscalYearEmployee
            .includes(:fiscal_year)
            .find_by(employee_id: @employee.id, fiscal_year_id: selected_fy_id)

    time_off_requests = TimeOffRequest
                          .includes(:dates, :fiscal_year_employee)
                          .where(fiscal_year_employee_id: fye&.id)

    @time_off_payload = time_off_requests.map do |req|
                            breakdown = req.dates.group(:decision).count
                            %w[pending approved denied].each { |status| breakdown[status] ||= 0 }

                            {
                              id: req.id,
                              from: req.from_date,
                              to: req.to_date,
                              reason: req.reason_caption,
                              status: req.status, # still useful maybe
                              decision_breakdown: breakdown,
                              amount: req.dates.map(&:amount).compact.sum,
                              fiscal_year_id: req.fiscal_year_employee.fiscal_year_id,
                              request_status: req.request_status,
                              final_decision: req.final_decision
                            }
                          end

    @fiscal_years = FiscalYear.order(start_date: :desc).map do |fy|
      {
        id: fy.id,
        caption: fy.caption
      }
    end

    if fye
      @summary = {
        earned_vacation_days: fye.earned_vacation_days,
        used_vacation:        fye.taken_vacation_days,
        remaining_vacation:   fye.remaining_vacation_days,
        allotted_pto_days:    fye.allotted_pto_days,
        used_pto:             fye.taken_pto_days,
        remaining_pto:        fye.remaining_pto_days
      }
    else
      @summary = {}
    end

    @attention_requests = time_off_requests.select do |req|
      req.dates.any? { |d| d.decision == "waiting_information" }
    end.map do |req|
      {
        id: req.id,
        from: req.from_date,
        to: req.to_date,
        reason: req.reason,
        edit_path: edit_employee_time_off_request_path(@employee, req)
      }
    end

    respond_to do |format|
      format.html { render :dashboard }
      format.json {
        render json: {
          time_off_payload: @time_off_payload,
          summary: @summary
        }
      }
    end
  end

  def new
    @employee = Employee.new
    @supervisors = Employee.where(is_supervisor: true).map { |s| { id: s.id, name: "#{s.first_name} #{s.last_name}" } }
  end

  def edit
    @employee = Employee.find(params[:id])
    @supervisors = Employee.where(is_supervisor: true).map { |s| { id: s.id, name: "#{s.first_name} #{s.last_name}" } }
  end

  def destroy
    @employee = Employee.find_by(id: params[:id])
    if @employee
      @employee.destroy
      respond_to do |format|
        format.html { redirect_to employees_url, notice: "Employee was successfully deleted." }
        format.json { head :no_content }
      end
    else
      respond_to do |format|
        format.html { redirect_to employees_url, alert: "Employee not found." }
        format.json { render json: { error: "Not found" }, status: :not_found }
      end
    end
  end

  def create
    @employee = Employee.new(employee_params)

    respond_to do |format|
      if @employee.save
        format.html { redirect_to @employee, notice: "Employee was successfully created." }
        format.json { render json: @employee, status: :created }  # ✅ Updated
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @employee.errors.full_messages, status: :unprocessable_entity }
      end
    end
  end

  def update
    if params[:employee][:password].blank?
      params[:employee].delete(:password)
      params[:employee].delete(:password_confirmation)
    end

    respond_to do |format|
      if @employee.update(employee_params)
        format.html { redirect_to @employee, notice: "Employee was successfully updated." }
        format.json { render json: @employee, status: :ok }  # ✅ Updated
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @employee.errors.full_messages, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_employee
    @employee = Employee.find_by(id: params[:id])
    redirect_to employees_path, alert: "Employee not found." and return unless @employee
  end

  def authorize_self!
    unless @employee && @employee.id == current_employee.id
      redirect_to root_path, alert: "Access denied." and return
    end
  end

    def employee_params
      params.require(:employee).permit(
        :first_name, :last_name, :email, :password, :password_confirmation, :hire_date,
        :termination_date, :is_administrator, :is_supervisor, :supervisor_id
      )
    end
end
