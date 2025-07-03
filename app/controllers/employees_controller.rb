# Author: Matthew Heering
# Description: Controls the flow of data from the employees model to the react views.
# Date: 6/18/25
class EmployeesController < ApplicationController
  before_action :set_employee, only: %i[show edit update]

  def index
    @employees = Employee.all
  end

  def show
    @employee = Employee.find(params[:id])

    fiscal_year_employees = FiscalYearEmployee
                              .includes(:fiscal_year)
                              .where(employee_id: @employee.id)

    time_off_requests = TimeOffRequest
                          .includes(:dates, :fiscal_year_employee)
                          .where(fiscal_year_employee_id: fiscal_year_employees.pluck(:id))

    @time_off_payload = time_off_requests.map do |req|
      {
        id: req.id,
        from: req.from_date,
        to: req.to_date,
        reason: req.reason_caption,
        status: req.status,
        amount: req.dates.map(&:amount).compact.sum,        
        fiscal_year_id: req.fiscal_year_employee.fiscal_year_id
      }
    end

    @fiscal_years = FiscalYear.order(start_date: :desc).map do |fy|
      {
        id: fy.id,
        caption: fy.caption
      }
    end

    total_earned_vacation = fiscal_year_employees.sum(&:earned_vacation_days)
    total_allotted_pto = fiscal_year_employees.sum(&:allotted_pto_days)
    used_vacation = fiscal_year_employees.sum { |fye| fye.taken_vacation_days }
    used_pto = fiscal_year_employees.sum { |fye| fye.taken_pto_days }

    @summary = {
      earned_vacation_days: total_earned_vacation,
      allotted_pto_days: total_allotted_pto,
      used_vacation: used_vacation,
      used_pto: used_pto
    }

    render :dashboard
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
      unless @employee
        redirect_to employees_path, alert: "Employee not found."
      end
    end

    def employee_params
      params.require(:employee).permit(
        :first_name, :last_name, :email, :password, :password_confirmation, :hire_date,
        :termination_date, :is_administrator, :is_supervisor, :supervisor_id
      )
    end
end
