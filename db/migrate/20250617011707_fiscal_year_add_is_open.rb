class FiscalYearAddIsOpen < ActiveRecord::Migration[8.0]
  def change
    add_column :fiscal_years, :is_open, :boolean, default: true, null: false
  end
end
