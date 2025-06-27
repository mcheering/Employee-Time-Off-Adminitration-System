class CreateTimeOffRequests < ActiveRecord::Migration[8.0]
  def change
    create_table :time_off_requests do |t|
      t.integer :fiscal_year_employee_id, null: false
      t.integer :supervisor_id, null: false
      t.integer :submitted_by, null: false
      t.date :request_date, null: false
      t.date :additional_information_date
      t.date :supervisor_decision_date
      t.date :final_decision_date
      t.integer :reason, null: false
      t.boolean :is_fmla, default: false
      t.string :comment

      t.timestamps
    end
  end
end
