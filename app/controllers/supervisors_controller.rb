# Author: Matthew Heering, William Pevytoe
# Description: sends data fro the supervisors model to the react views.
# Date: 6/18/25
class SupervisorsController < ApplicationController
  # before_action :ensure_supervisor!

  # def index
  #   # @supervisor       = current_employee
  #   @supervisors = Employee.where(is_supervisor: true)
  #   @employees = Employee.where(supervisor_id: current_employee.id)
  #   @time_off_requests = TimeOffRequest.where(supervisor_id: params[:id])
  #   @status_options  = [
  #     ["All", ""],
  #     ["Waiting for information", "waiting_information"],
  #     ["Decided", "decided"],
  #     ["Pending", "pending"]
  #   ]

  #   current_fy = @fiscal_years.find { |fy| fy.start_date <= Date.current &&
  #                                     fy.end_date   >= Date.current }
  #   @selected_fy = params[:fiscal_year_id].presence || current_fy&.id
  #   @selected_status = params[:status].presence

  #   requests = TimeOffRequest.where(supervisor_id: @supervisor.id)

  #   if @selected_fy
  #     requests = requests.joins(:fiscal_year_employee)
  #                        .where(fiscal_year_employees: { fiscal_year_id: @selected_fy })
  #   end

  #   @time_off_requests =
  #     if @selected_status
  #       requests.select { |r| r.status.to_s == @selected_status }
  #     else
  #       requests.to_a
  #     end
  # end

  # def index
  #   @supervisors = Employee.where(is_supervisor: true)
  # end

  def show
    @supervisor      = Employee.find(params[:id])
    @fiscal_years    = FiscalYear.all
    @status_options = [
      [ "All",                      "" ],
      [ "Waiting for information",  "waiting_information" ],
      [ "Approved",                 "supervisor_reviewed" ],
      [ "Decided",                  "decided" ],
      [ "Pending",                  "pending" ]
    ]

    current_fy = @fiscal_years.find { |fy| fy.start_date <= Date.current &&
                                          fy.end_date   >= Date.current }
    @selected_fy = params[:fiscal_year_id].presence || current_fy&.id
    @selected_status = params[:status].presence

    requests = TimeOffRequest.where(supervisor_id: @supervisor.id)

    if @selected_fy
      requests = requests.joins(:fiscal_year_employee)
                         .where(fiscal_year_employees: { fiscal_year_id: @selected_fy })
    end

    @time_off_requests =
      if @selected_status
        requests.select { |r| r.status.to_s == @selected_status }
      else
        requests.to_a
      end

    @employees = Employee.where(supervisor_id: @supervisor.id)
    
    render :index
  end

  # def approve
  #   @request = TimeOffRequest.find(params[:id])
  #   @request.update!(request_status: 'decided', final_decision_date: Date.today)
  #   redirect_to supervisor_path(params[:supervisor_id]), notice: "Request approved."
  # end

  def calendar
    @supervisor   = Employee.find(params[:id])
    @fiscal_years = FiscalYear.order(start_date: :desc)
    current_fy = @fiscal_years.find { |fy| fy.start_date <= Date.current &&
                                          fy.end_date   >= Date.current }
    @selected_fy = params[:fiscal_year_id].presence || current_fy&.id

    reqs = TimeOffRequest.where(supervisor_id: @supervisor.id)
    
  
    if @selected_fy
      reqs = reqs.joins(:fiscal_year_employee)
                 .where(fiscal_year_employees: { fiscal_year_id: @selected_fy })
    end

    @by_date = reqs
      .includes(:dates, fiscal_year_employee: :employee) 
      .flat_map { |r|
        r.dates.map { |d|
          {
            date:           d.date,
            employee_name:  r.fiscal_year_employee.employee_name,
            amount:         d.amount,
            reason:         r.reason,    
            status:         r.status,     
          }
        }
      }
      .group_by { |entry| entry[:date] }
  end

  def employee_records
    @supervisor   = Employee.find(params[:id])
    @fiscal_years = FiscalYear.order(start_date: :desc)

    current_fy = @fiscal_years.find { |fy| fy.start_date <= Date.current &&
                                          fy.end_date   >= Date.current }
    @selected_fy = params[:fiscal_year_id].presence || current_fy&.id

    team_ids = Employee.where(supervisor_id: @supervisor.id).pluck(:id)

    @fye_records = FiscalYearEmployee
      .includes(:employee)
      .where(employee_id: team_ids, fiscal_year_id: @selected_fy)
  end

  # def ensure_supervisor!
  #   unless current_employee.is_supervisor?
  #     redirect_to choose_role_path, alert: "You’re not a supervisor"
  #   end
  # end
end
