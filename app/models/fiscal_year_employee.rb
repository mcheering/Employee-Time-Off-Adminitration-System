class FiscalYearEmployee < ApplicationRecord
  belongs_to :employee
  belongs_to :fiscal_year
end
