class ApplicationController < ActionController::Base
  allow_browser versions: :modern
  helper_method :user_signed_in?, :current_employee_admin?, :current_employee_supervisor?

  private

  def current_employee_admin?
    current_employee&.is_administrator?
  end

  def current_employee_supervisor?
    current_employee&.is_supervisor?
  end

  def authorize_admin!
    unless current_employee_admin?
      redirect_to root_path, alert: "Access denied."
    end
  end

  def authorize_self!(employee)
    unless current_employee_admin? || employee.id == current_employee.id
      redirect_to root_path, alert: "Access denied."
    end
  end

  def authorize_supervisor_of!(employee)
    unless current_employee_admin? || (current_employee_supervisor? && employee.supervisor_id == current_employee.id)
      redirect_to root_path, alert: "Access denied."
    end
  end
end
