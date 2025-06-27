# Author: Matthew Heering
# Description: sends data fro the supervisors model to the react views.
# Date: 6/18/25
class SupervisorsController < ApplicationController
  # before_action :ensure_supervisor!

  def index
    @employees = Employee.where(supervisor_id: current_employee.id)
  end

  def show
    @employees = Employee.where(supervisor_id: params[:id])
    render :index

    #@time_off_requests = TimeOffRequest.where(supervisor_id: params[:id])
  end

  # def ensure_supervisor!
  #   unless current_employee.is_supervisor?
  #     redirect_to choose_role_path, alert: "You’re not a supervisor"
  #   end
  # end
end
