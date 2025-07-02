class SupervisorsController < ApplicationController
  def show
    @supervisor = Employee.find(params[:id])
    @fiscal_years = FiscalYear.order(start_date: :desc)

    # Select current FY or fallback
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

    # === TIME-OFF REQUESTS ===
    team_ids = Employee.where(supervisor_id: @supervisor.id).pluck(:id)

    requests = TimeOffRequest
      .includes(:dates, fiscal_year_employee: :employee)
      .joins(fiscal_year_employee: :employee)
      .where(employees: { id: team_ids })

    if @selected_fy
      requests = requests.where(fiscal_year_employees: { fiscal_year_id: @selected_fy.id })
    end

    # TEMPORARILY DISABLED: status filtering to debug missing data
    # if @selected_status.present?
    #   requests = requests.select { |r| r.status.to_s == @selected_status }
    # end
    Rails.logger.debug "➡️ Unfiltered Request Count: #{requests.count}"

    if @selected_status.present?
      Rails.logger.debug "🟨 Filtering requests by status: #{@selected_status}"
      requests = requests.select do |r|
        Rails.logger.debug "➡️ Request ID: #{r.id} | Status: #{r.status}"
        r.status.to_s == @selected_status
      end
    end
Rails.logger.debug "➡️ Filtered Request Count: #{requests.count}"
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

    # === DEBUG LOGGING ===
    Rails.logger.debug "➡️ Supervisor: #{@supervisor.inspect}"
    Rails.logger.debug "➡️ Selected FY: #{@selected_fy.inspect}"
    Rails.logger.debug "➡️ Fiscal Years: #{@fiscal_years.map(&:id)}"
    Rails.logger.debug "➡️ Time-Off Requests Payload Count: #{@time_off_requests_payload.size}"
    Rails.logger.debug "➡️ Calendar Data Dates: #{@calendar_data.keys}"
    Rails.logger.debug "➡️ FYE Records Count: #{@fye_records.size}"

    render :show
  end
end