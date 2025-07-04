#Author: Matthew Heering & William Pevytoe
#Description:  Handles data relate to supervisor to send correct data to the view, and take in requests from the view
#Date: 7/2/25
class SupervisorsController < ApplicationController
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
      ["All", ""],
      ["Waiting for information", "waiting_information"],
      ["Approved", "supervisor_reviewed"],
      ["Decided", "decided"],
      ["Pending", "pending"]
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
      Rails.logger.debug "🟨 Filtering requests by status: #{@selected_status}"
      requests = requests.select do |r|
        Rails.logger.debug "➡️ Request ID: #{r.id} | Status: #{r.status}"
        r.status.to_s == @selected_status
      end
    end
    @time_off_requests_payload = requests.map do |req|
      counts = req.dates.group(:decision).count
    
      breakdown = {
        "pending" => 0,
        "approved" => 0,
        "denied" => 0
      }
    
      counts.each do |k, v|
        if k.is_a?(String) && breakdown.key?(k)
          breakdown[k] = v
        else
          status = TimeOff.decisions.key(k)
          breakdown[status] = v if status && breakdown.key?(status)
        end
      end
    
      {
        id: req.id,
        employee_name: req.fiscal_year_employee&.employee&.name || "Unknown",
        from: req.from_date,
        to: req.to_date,
        reason: req.reason,
        amount: req.dates.sum(&:amount),
        decision_breakdown: breakdown
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
end