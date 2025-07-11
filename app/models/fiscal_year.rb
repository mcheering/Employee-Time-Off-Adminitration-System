# Authors: William Pevytoe, Terry Thompson
# Date: 2024-06-20
# Description: Model of a company's accounting year.  Automatically creates fiscal year
# employees when a fiscal year is created.
class FiscalYear < ApplicationRecord
    after_initialize :set_default_is_open
    after_create :create_fiscal_year_employees

    has_many :fiscal_year_employees
    has_many :employees, through: :fiscal_year_employees

    validates :start_date, :end_date, :is_open, presence: true, on: :create
    validates :is_open, inclusion: { in: [ true, false ] }
    validate :start_date_before_end_date
    validate :start_date_not_in_existing_fiscal_years
    validate :end_date_not_in_existing_fiscal_years

    # Author: Terry Thompson
    # Date: 2024-06-20
    # Description: Displays a string that indicates the fiscal year
    def caption
        start_date.year == end_date.year ? "#{start_date.year}" : "#{start_date.year}-#{end_date.strftime('%y')}"
    end

    # Author: Terry Thompson
    # Date: 2024-06-20
    # Description: Displays a string that whether the fiscal year is open or closed
    def status
      is_open ? "open" : "closed"
    end

    private

    # Author: William Pevytoe
    # Date: 2024-06-20
    # Description: Creates fiscal year employee records for all active employees
    def create_fiscal_year_employees
        Employee.all.each do |employee|
            if employee.hire_date <= self.end_date && (employee.termination_date.nil? || employee.termination_date >= start_date)
                FiscalYearEmployee.create!(fiscal_year: self, employee: employee)
            end
        end
    end

    # Author: Terry Thompson
    # Date: 2024-06-20
    # Description: Sets default value of is_open to true
    def set_default_is_open
        self.is_open = true if self.is_open.nil?
    end

    # Author: Terry Thompson
    # Date: 2024-06-20
    # Description: Ensures that start_date is before end_date
    def start_date_before_end_date
        if start_date.present? && end_date.present? && start_date >= end_date
            errors.add(:start_date, "must be before end date")
        end
    end

    # Author: Terry Thompson
    # Date: 2024-06-20
    # Description: Ensures start_date does not overlap with existing fiscal years
    def start_date_not_in_existing_fiscal_years
        return unless will_save_change_to_start_date? # only validate if changed
        if start_date.present?
            overlapping_fiscal_years = FiscalYear.where.not(id: id)
                                                  .where("start_date <= ? AND end_date >= ?", start_date, start_date)
            if overlapping_fiscal_years.exists?
                errors.add(:start_date, "overlaps with an existing fiscal year")
            end
        end
    end

    # Author: Terry Thompson
    # Date: 2024-06-20
    # Description: Ensures end_date does not overlap with existing fiscal years
    def end_date_not_in_existing_fiscal_years
        return unless will_save_change_to_end_date? # only validate if changed
        if end_date.present?
            overlapping_fiscal_years = FiscalYear.where.not(id: id)
                                                  .where("start_date <= ? AND end_date >= ?", end_date, end_date)
            if overlapping_fiscal_years.exists?
                errors.add(:end_date, "overlaps with an existing fiscal year")
            end
        end
    end
end
