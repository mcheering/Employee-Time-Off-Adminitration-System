class AdministratorsController < ApplicationController
  def index
    @administrators = Administrator.all_administrators
  end

  # Author: Matthew Heering
  # Description: Passes enriched data to the dashboard view
  # Date: 6/15/25
  def dashboard
    @employees = Employee.all
    @fiscal_years = FiscalYear.all

    @fiscal_year_employees = FiscalYearEmployee.includes(:employee, :fiscal_year).map do |fye|
      emp = fye.employee
      fy = fye.fiscal_year

      # Calculate years with company from hire date to fiscal year start
      years_with_company = ((fy.start_date - emp.hire_date).to_i / 365.25).floor

      # Determine earned vacation days
      vacation_days = if years_with_company <= 1
                        10
                      elsif years_with_company < 5
                        15
                      else
                        20
                      end

      {
        id: fye.id,
        employee_id: emp.id,
        employee_name: "#{emp.first_name} #{emp.last_name}",
        hire_date: emp.hire_date,
        fiscal_year_id: fy.id,
        fiscal_year_caption: fy.caption,
        earned_vacation_days: vacation_days,
        allotted_pto_days: 0 # Placeholder until PTO logic is implemented
      }
    end
  end
end