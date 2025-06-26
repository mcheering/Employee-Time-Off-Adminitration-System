class CreateTimeOffRequests < ActiveRecord::Migration[8.0]
  def change
    create_table :time_off_requests do |t|
      t.integer :fiscal_year_employee_id, null: false
      t.integer :supervisor_id, null: false
      t.integer :submitted_by, null: false
      t.date :request_date
      t.integer :reason
      t.boolean :is_fmla
      t.string :decision_date
      t.string :comment

      t.timestamps
    end
  end
end
