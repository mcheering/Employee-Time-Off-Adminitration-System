# Authors: William Pevytoe, Terry Thompson
# Date: 2024-06-20
# Description: Model of a company's accounting year.
class FiscalYear < ApplicationRecord
    has_many :fiscal_year_employees
    has_many :employees, through: :fiscal_year_employees

    validates :start_date, :end_date, presence: true
    validate :start_date_before_end_date

    # Author: Terry Thompson
    # Date: 2024-06-20
    # Description: Displays a string that indicates the fiscal year
    def caption
        start_date.year == end_date.year ? "#{start_date.year}" : "#{start_date.year}-#{end_date.strftime('%y')}"
    end

    private
    def start_date_before_end_date
        if start_date.present? && end_date.present? && start_date >= end_date
            errors.add(:start_date, "must be before end date")
        end
    end
end
