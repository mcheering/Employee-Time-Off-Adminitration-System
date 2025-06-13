class CreateFiscalYearEmployees < ActiveRecord::Migration[8.0]
  def change
    create_table :fiscal_year_employees do |t|
      t.references :employee, null: false, foreign_key: true
      t.references :fiscal_year, null: false, foreign_key: true

      t.timestamps
    end
  end
end
