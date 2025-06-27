class RenameSubmittedByToSubmittedByIdInTimeOffRequests < ActiveRecord::Migration[8.0]
  def change
    rename_column :time_off_requests, :submitted_by, :submitted_by_id
  end
end
