class AdministratorsController < ApplicationController
  def dashboard
    Rails.logger.debug "⚙️ DASHBOARD action called"

    @employees = Employee.all
    Rails.logger.debug "📋 Employees loaded: #{@employees.size}"
    @employees.each { |e| Rails.logger.debug "👤 #{e.id}: #{e.first_name} #{e.last_name}" }

    @fiscal_years = FiscalYear.all
    Rails.logger.debug "📅 Fiscal Years loaded: #{@fiscal_years.size}"
    @fiscal_years.each { |fy| Rails.logger.debug "🗓 #{fy.id}: #{fy.start_date} - #{fy.end_date}" }

    @fiscal_year_employees = FiscalYearEmployee.includes(:employee, :fiscal_year).map do |fye|
      emp = fye.employee
      fy = fye.fiscal_year

      years_with_company = ((fy.start_date - emp.hire_date).to_i / 365.25).floor

      vacation_days = if years_with_company <= 1
                        10
                      elsif years_with_company < 5
                        15
                      else
                        20
                      end

      record = {
        id: fye.id,
        employee_id: emp.id,
        employee_name: "#{emp.first_name} #{emp.last_name}",
        hire_date: emp.hire_date,
        fiscal_year_id: fy.id,
        fiscal_year_caption: fy.caption,
        earned_vacation_days: vacation_days,
        allotted_pto_days: 0
      }

      Rails.logger.debug "📦 FiscalYearEmployee ##{fye.id}: #{record.inspect}"
      record
    end

    Rails.logger.debug "✅ Finished preparing all data"
  end
end