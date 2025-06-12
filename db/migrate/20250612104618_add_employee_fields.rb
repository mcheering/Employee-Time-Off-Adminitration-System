class AddEmployeeFields < ActiveRecord::Migration[8.0]
  def change
    add_reference :employees, :supervisor, foreign_key: { to_table: :employees }, index: true
    add_column :employees, :first_name, :string, null: false
    add_column :employees, :last_name, :string, null: false
    add_column :employees, :hire_date, :date, null: false
    add_column :employees, :termination_date, :date
    add_column :employees, :is_supervisor, :boolean, default: false
    add_column :employees, :is_administrator, :boolean, default: false
  end
end
