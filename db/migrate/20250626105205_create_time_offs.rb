class CreateTimeOffs < ActiveRecord::Migration[8.0]
  def change
    create_table :time_offs do |t|
      t.integer :request_id
      t.float :amount
      t.boolean :was_taken
      t.integer :decision

      t.timestamps
    end
  end
end
