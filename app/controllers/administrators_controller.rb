# Author: Matthew Heering
# Description:  Controls data for adminstrators going to the adminstrative dashboard. 
# Date: 6/18/25
class AdministratorsController < ApplicationController
  def dashboard

    @employees = Employee.all
    @employees.each { |e| Rails.logger.debug "👤 #{e.id}: #{e.first_name} #{e.last_name}" }
 
    @fiscal_years = FiscalYear.all
    @fiscal_years.each { |fy| Rails.logger.debug "🗓 #{fy.id}: #{fy.start_date} - #{fy.end_date}" }
 
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

  end
end