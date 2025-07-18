class AdministratorsController < ApplicationController
  before_action :authorize_admin!
  def dashboard
    @employees_raw = Employee.all

    @fiscal_years = FiscalYear.order(:start_date).map do |fy|
      {
        id: fy.id,
        start_date: fy.start_date,
        end_date: fy.end_date,
        is_open: fy.is_open,
        caption: fy.caption
      }
    end
    employee_lookup = @employees_raw.index_by(&:id)

    @time_off_requests = TimeOffRequest
      .includes(:dates, fiscal_year_employee: :employee)
      .map do |req|
        breakdown = req.dates.group(:decision).count
        %w[pending approved denied].each { |s| breakdown[s] ||= 0 }

        employee = req.fiscal_year_employee&.employee
        supervisor_id = employee&.supervisor_id

        {
          id: req.id,
          employee_name: employee&.name || "Unknown",
          employee_id: employee&.id,
          supervisor_id: supervisor_id,
          from: req.from_date,
          to: req.to_date,
          reason: req.reason_caption,
          status: req.status,
          decision_breakdown: breakdown,
          amount: req.dates.sum(&:amount),
          fiscal_year_id: req.fiscal_year_employee&.fiscal_year_id,
          supervisor_name: supervisor_id ? employee_lookup[supervisor_id]&.name || "None" : "None",
          request_status: req.request_status,
          final_decision: req.final_decision
        }
      end

    active_supervisor_ids = @time_off_requests
      .map { |r| r[:supervisor_id] }
      .compact
      .uniq

    @supervisors = Employee.where(id: active_supervisor_ids).map do |s|
      { id: s.id, name: s.name }
    end

    @employees = @employees_raw.map do |e|
      {
        id: e.id,
        name: "#{e.first_name} #{e.last_name}",
        email: e.email,
        hire_date: e.hire_date,
        termination_date: e.termination_date,
        is_administrator: e.is_administrator,
        is_supervisor: e.is_supervisor,
        supervisor_id: e.supervisor_id,
        supervisor_name: employee_lookup[e.supervisor_id]&.name || "None"
      }
    end

    @fiscal_year_employees = FiscalYearEmployee.includes(:employee, :fiscal_year).map do |fye|
      {
        id: fye.id,
        employee_id: fye.employee.id,
        employee_name: fye.employee_name,
        hire_date: fye.employee_hire_date,
        fiscal_year_id: fye.fiscal_year.id,
        fiscal_year_caption: fye.fiscal_year_caption,
        earned_vacation_days: fye.earned_vacation_days,
        allotted_pto_days: fye.allotted_pto_days
      }
    end

    @ready_for_admin_requests = TimeOffRequest
  .includes(fiscal_year_employee: :employee)
  .where.not(supervisor_decision_date: nil)
  .where(admin_decision_date: nil)
  .map do |req|
    {
      id: req.id,
      employee_name: req.fiscal_year_employee.employee.name,
      supervisor_name: req.fiscal_year_employee.employee.supervisor&.name || "Unknown",
      from: req.from_date,
      edit_path: "/administrators/time_off_requests/#{req.id}/manage"
    }
  end
  end
end
