# Authors: William Pevytoe, Terry Thompson
# Date: 2024-06-20
# Description: Join model between Employee and FiscalYear. Shows which employee worked during
# a given fiscal year.
class FiscalYearEmployee < ApplicationRecord
  belongs_to :employee
  belongs_to :fiscal_year
  has_many :fiscal_year_employee

  has_many :time_off_requests,
           foreign_key: "fiscal_year_employee_id",
           dependent:   :destroy

  has_many :dates,
           through:    :time_off_requests


  delegate :name,             to: :employee,     prefix: :employee
  delegate :hire_date,        to: :employee,     prefix: :employee
  delegate :termination_date, to: :employee,     prefix: :employee
  delegate :caption,          to: :fiscal_year,  prefix: :fiscal_year

  validates :fiscal_year_id, :employee_id, presence: true

  # Author: Terry Thompson
  # Date: 2024-06-20
  # Description: Number of year's the employee the employee has worked for the company at
  # the start of the fiscal year.  Credits a full year if the employee was hired more than
  # six months before the fiscal year start date.  Employee hired on or after the fiscal
  # year start date have 0 years of service.
  def years_of_service
    if employee.hire_date.month < 7
      fiscal_year.end_date.year - employee.hire_date.year
    else
      fiscal_year.end_date.year - employee.hire_date.year - 1
    end
  end

  # Author: Terry Thompson
  # Date: 6/18/2025
  # Description: The number of vacation days the employee will earn during the fiscal year
  # based on years of service.
  def earned_vacation_days
    case years_of_service
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
  # Date: 6/18/2025
  # Description: Employees hired before the start of the fiscal year are allotted 9 PTO days for the
  # Employees hired during the fiscal year are allotted a prorated amount of PTO days based on
  # the number of days remaining in the year rounded to the nearest half day.
  # PTO days can be used for sick leave or personal days.
  def allotted_pto_days
    months_remaining = (fiscal_year.end_date.month - employee.hire_date.month) + 1
    if months_remaining < 0
      months_remaining += 12
    end

    if employee.hire_date <= fiscal_year.start_date
      9
    else
      days_remaining = fiscal_year.end_date - employee.hire_date + 1
      days_in_year = fiscal_year.end_date - fiscal_year.start_date + 1
      (9 * days_remaining / days_in_year / 0.5).round(0) * 0.5
    end
  end

  # Author: Terry Thompson
  # Date: 7/2/2025
  # Description: Calculates the number of PTO days taken by the employee during the fiscal year
  def taken_pto_days
    days_used_for(:pto)
  end

  # Author: Terry Thompson
  # Date: 7/2/2025
  # Description: Calculates the number of vacation days taken by the employee during the fiscal year
  def taken_vacation_days
    days_used_for(:vacation)
  end

  # Author: Terry Thompson
  # Date: 7/2/2025
  # Description: Calculates the number of jury duty days taken by the employee during the fiscal year
  def taken_jury_duty_days
    days_used_for(:jury_duty)
  end

  # Author: Terry Thompson
  # Date: 7/2/2025
  # Description: Calculates the number of bereavement days taken by the employee during the fiscal year
  def taken_bereavement_days
    days_used_for(:bereavement)
  end

  # Author: Terry Thompson
  # Date: 7/2/2025
  # Description: Calculates the number of unpaid days taken by the employee during the fiscal year
  def taken_unpaid_days
    days_used_for(:unpaid)
  end

  # Author: Terry Thompson
  # Date: 7/2/2025
  # Description: Calculates the number of other days taken by the employee during the fiscal year
  def taken_other_days
    days_used_for(:other)
  end

  # Author: Terry Thompson
  # Date: 7/2/2025
  # Description: Calculates the employees' unused PTO for the fiscal year
  def pto_remaining
    allotted_pto_days - taken_pto_days
  end

  # Author: Terry Thompson
  # Date: 7/2/2025
  # Description: Calculates the employees' unused vacation days for the fiscal year
  def vacation_remaining
    earned_vacation_days - taken_vacation_days
  end

  private
  # Author: William Pevytoe
  # Date: 6/27/2025
  def days_used_for(reason_sym)
    time_off_requests
      .where(reason: reason_sym)
      .joins(:dates)
      .sum("dates.amount")
  end
end
