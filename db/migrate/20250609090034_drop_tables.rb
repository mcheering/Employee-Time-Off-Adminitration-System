class DropTables < ActiveRecord::Migration[8.0]
  def change
    drop_table :users, if_exists: true
    drop_table :employees, if_exists: true
  end
end
