# Author: Matthew Heering
# Description: Sends data from the supervisors model to the React views.
# Date: 6/18/25

class SupervisorsController < ApplicationController
  def show
    @supervisor = Employee.find(params[:id])

    @fiscal_years = FiscalYear.order(start_date: :desc)

    current_fy = @fiscal_years.find { |fy| fy.start_date <= Date.current && fy.end_date >= Date.current }
    @selected_fy = params[:fiscal_year_id].presence || current_fy&.id
    @selected_status = params[:status].presence || ""

    @status_options = [
      ["All", ""],
      ["Waiting for information", "waiting_information"],
      ["Approved", "supervisor_reviewed"],
      ["Decided", "decided"],
      ["Pending", "pending"]
    ]

    # === TIME-OFF REQUESTS ===
    requests = TimeOffRequest
                 .includes(:dates, fiscal_year_employee: :employee)
                 .where(supervisor_id: @supervisor.id)

    if @selected_fy
      requests = requests.joins(:fiscal_year_employee)
                         .where(fiscal_year_employees: { fiscal_year_id: @selected_fy })
    end

    if @selected_status.present?
      requests = requests.select { |r| r.status.to_s == @selected_status }
    end

    @time_off_requests_payload = requests.map do |req|
      {
        id: req.id,
        employee_name: req.fiscal_year_employee&.employee&.name || "Unknown",
        from: req.from_date,
        to: req.to_date,
        reason: req.reason,
        status: req.status,
        amount: req.dates.sum(&:amount)
      }
    end

    # === CALENDAR VIEW DATA ===
    @calendar_data = requests.flat_map do |req|
      req.dates.map do |date|
        {
          date: date.date,
          employee_name: req.fiscal_year_employee&.employee&.name || "Unknown",
          reason: req.reason,
          status: req.status,
          amount: date.amount
        }
      end
    end.group_by { |entry| entry[:date] }

    # === EMPLOYEE RECORDS VIEW ===
    team_ids = Employee.where(supervisor_id: @supervisor.id).pluck(:id)
    @fye_records = FiscalYearEmployee
                 .includes(:employee)
                 .where(employee_id: team_ids, fiscal_year_id: @selected_fy)
                 .map do |fye|
  {
    employee_name: fye.employee&.name || "Unknown",
    earned_vacation_days: fye.earned_vacation_days,
    allotted_pto_days: fye.allotted_pto_days
  }
end
    render :show
  end
end