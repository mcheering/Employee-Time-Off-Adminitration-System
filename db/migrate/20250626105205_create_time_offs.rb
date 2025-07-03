class CreateTimeOffs < ActiveRecord::Migration[8.0]
  def change
    create_table :time_offs do |t|
      t.integer :time_off_request_id, null: false
      t.date    :date,                null: false
      t.float   :amount,              null: false
      t.boolean :was_taken,                        default: true
      t.integer :decision,            null: false, default: 0

      t.timestamps
    end
  end
end
