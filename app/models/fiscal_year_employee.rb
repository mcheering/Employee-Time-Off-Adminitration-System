# Authors: William Pevytoe, Terry Thompson
# Date: 2024-06-20
# Description: Join model between Employee and FiscalYear. Shows which employee worked during
# a given fiscal year.
class FiscalYearEmployee < ApplicationRecord
  belongs_to :employee
  belongs_to :fiscal_year

  # Author: Terry Thompson
  # Date: 2024-06-20
  # Description: Returns the employee's full name.
  def employee_name
    employee.name
  end

  # Author: Terry Thompson
  # Date: 2024-06-20
  # Description: String that represents the fiscal year.
  def fiscal_year_caption
    fiscal_year.caption
  end

  # Author: Terry Thompson
  # Date: 2024-06-20
  # Description: Date the employee was hired.
  def employee_hire_date
    employee.hire_date
  end

  # Author: Terry Thompson
  # Date: 2024-06-20
  # Description: Date the employee terminated employment.  Nil if the employee is active.
  def employee_termination_date
    employee.termination_date
  end

  # Author: Terry Thompson
  # Date: 2024-06-20
  # Description: Number of year's the employee the employee has worked for the company at
  # the start of the fiscal year.  Credits a full year if the employee was hired before
  # July 1.  Employee hired on or after the fiscal year start date have 0 years of service.
  def years_of_service
    if employee.hire_date < fiscal_year.end_date
      if employee.hire_date.month < 7
        fiscal_year.end_date.year - employee.hire_date.year
      else
        fiscal_year.end_date.year - employee.hire_date.year - 1
      end
    else
      0
    end
  end

  # Author: Terry Thompson
  # Date: 2024-06-20
  # Description: The number of vacation days the employee earned before
  # the start of the fiscal year.
  def earned_vacation_days
    years = years_of_service
    case years
    when 0
      0
    when 1..5
      10
    when 6..15
      15
    else
      20
    end
  end

  # Author: Terry Thompson
  # Date: 2024-06-20
  # Description: Employees hired before the start of the fiscal year are allotted 9 PTO days.
  # Employees hired during the fiscal year are allotted a prorated number of PTO days.
  # PTO days can be used for sick leave or personal days.
  #
  # NOTE: This first version assumes a January 1 fiscal year start date.  If most be modified
  def allotted_pto_days
    months_remaining = (fiscal_year.end_date.month - employee.hire_date.month) + 1
    if months_remaining < 0
      months_remaining += 12
    end

    if hire_date <= fiscal_year.start_date
      9
    else
      (9 * months_remaining / 12).round(0)
    end
  end
end
