# Authors: William Pevytoe, Terry Thompson
# Date: 2024-06-20
# Description: Model of a company's accounting year.
class FiscalYear < ApplicationRecord
    has_many :fiscal_year_employees
    has_many :employees, through: :fiscal_year_employees

    # Author: Terry Thompson
    # Date: 2024-06-20
    # Description: Displays a string that indicates the fiscal year
    def caption
        start_date.year == end_date.year ? "#{start_date.year}" : "#{start_date.year}-#{end_date.strftime('%y')}"
    end
end
