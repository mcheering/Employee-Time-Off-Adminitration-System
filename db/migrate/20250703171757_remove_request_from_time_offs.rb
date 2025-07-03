class RemoveRequestFromTimeOffs < ActiveRecord::Migration[8.0]
  def change
    remove_index :time_offs, :request_id if index_exists?(:time_offs, :request_id)
    remove_column :time_offs, :request_id, :integer
  end
end