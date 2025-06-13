class FiscalYear < ApplicationRecord
    has_many :fiscal_year_employees
    has_many :employees, through: :fiscal_year_employees
end
