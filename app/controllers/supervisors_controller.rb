class SupervisorsController < ApplicationController
  before_action :authorize_supervisor_or_admin!

  def show
    @supervisor = Employee.find(params[:id])
    @fiscal_years = FiscalYear.order(start_date: :desc)

    current_fy = @fiscal_years.find { |fy| fy.start_date <= Date.current && fy.end_date >= Date.current }
    @selected_fy = if params[:fiscal_year_id].present?
      FiscalYear.find_by(id: params[:fiscal_year_id])
    else
      current_fy || @fiscal_years.first
    end

    @selected_status = params[:status].presence || ""

    @status_options = [
      [ "All", "" ],
      [ "Waiting for information", "waiting_information" ],
      [ "Approved", "supervisor_reviewed" ],
      [ "Decided", "decided" ],
      [ "Pending", "pending" ]
    ]

    team_ids = Employee.where(supervisor_id: @supervisor.id).pluck(:id)

    requests = TimeOffRequest
      .includes(:dates, fiscal_year_employee: :employee)
      .joins(fiscal_year_employee: :employee)
      .where(employees: { id: team_ids })

    if @selected_fy
      requests = requests.where(fiscal_year_employees: { fiscal_year_id: @selected_fy.id })
    end

    if @selected_status.present?
      requests = requests.select { |r| r.status.to_s == @selected_status }
    end

    @time_off_requests_payload = requests.map do |req|
      counts = req.dates.group(:decision).count
      breakdown = { "pending" => 0, "approved" => 0, "denied" => 0 }
      counts.each do |k, v|
        if k.is_a?(String) && breakdown.key?(k)
          breakdown[k] = v
        else
          status = TimeOff.decisions.key(k)
          breakdown[status] = v if status && breakdown.key?(status)
        end
      end

      employee = req.fiscal_year_employee&.employee

      {
        id: req.id,
        employee_name: employee&.name || "Unknown",
        employee_id: employee&.id,
        supervisor_id: @supervisor.id,
        from: req.from_date,
        to: req.to_date,
        reason: req.reason,
        amount: req.dates.sum(&:amount),
        decision_breakdown: breakdown,
        request_status: req.request_status,
        final_decision: req.final_decision
      }
    end

    @updated_requests = TimeOffRequest
      .includes(:fiscal_year_employee)
      .where(fiscal_year_employees: { employee_id: team_ids })
      .where("time_off_requests.updated_at > time_off_requests.supervisor_decision_date")
      .map do |req|
        {
          id: req.id,
          employee_name: req.fiscal_year_employee.employee.name,
          from: req.from_date,
          edit_path: Rails.application.routes.url_helpers.manage_supervisor_time_off_request_path(
            supervisor_id: @supervisor.id,
            id: req.id
          )
        }
      end

    @calendar_data = requests.flat_map do |req|
      req.dates.map do |date|
        {
          date: date.date,
          employee_name: req.fiscal_year_employee&.employee&.name || "Unknown",
          reason: req.reason,
          amount: date.amount,
          status: date.decision
        }
      end
    end.group_by { |entry| entry[:date] }

    @fye_records = if @selected_fy
      FiscalYearEmployee
        .includes(:employee)
        .where(employee_id: team_ids, fiscal_year_id: @selected_fy.id)
        .map do |fye|
          {
            employee_name: fye.employee&.name || "Unknown",
            earned_vacation_days: fye.earned_vacation_days,
            allotted_pto_days: fye.allotted_pto_days
          }
        end
    else
      []
    end

    render :show
  end

  private

  def authorize_supervisor_or_admin!
    unless current_employee.is_administrator? || params[:id].to_i == current_employee.id
      redirect_to root_path, alert: "Access denied."
    end
  end
end
