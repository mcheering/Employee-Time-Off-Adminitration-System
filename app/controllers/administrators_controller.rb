class AdministratorsController < ApplicationController
  def index
    @administrators = Administrator.all_administrators()
  end

  #Author: Matthew Heering
  #Description: passes data to the view
  #Date: 6/14/25
  def dashboard
    @employees = Employee.all
    @fiscal_years = FiscalYear.all
    @fiscal_year_employees = FiscalYearEmployee.includes(:employee, :fiscal_year).all
  end
end
