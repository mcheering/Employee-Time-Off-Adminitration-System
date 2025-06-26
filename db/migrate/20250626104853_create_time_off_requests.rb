class CreateTimeOffRequests < ActiveRecord::Migration[8.0]
  def change
    create_table :time_off_requests do |t|
      t.integer :employee_id
      t.integer :supervisor_id
      t.integer :submitted_by
      t.integer :fiscal_year_id
      t.date :request_date
      t.integer :reason
      t.boolean :is_fmla
      t.string :decision_date
      t.string :comment

      t.timestamps
    end
  end
end
