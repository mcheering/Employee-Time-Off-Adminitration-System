# Authors: William Pevytoe, Terry Thompson
# Date: 2024-06-20
# Description: Model of a company's accounting year.
class FiscalYear < ApplicationRecord
    after_initialize :set_default_is_open
    has_many :fiscal_year_employees
    has_many :employees, through: :fiscal_year_employees

    validates :start_date, :end_date, :is_open, presence: true
    validate :start_date_before_end_date

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
      is_posted ? "open" : "closed"
    end

    private
    def set_default_is_open
        self.is_open ||= true
    end
    def start_date_before_end_date
        if start_date.present? && end_date.present? && start_date >= end_date
            errors.add(:start_date, "must be before end date")
        end
    end
end
