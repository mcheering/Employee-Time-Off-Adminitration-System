class AddRequestStatusAndFinalDecisionToTimeOffRequests < ActiveRecord::Migration[7.0]
  def change
    add_column :time_off_requests, :request_status, :integer, default: 0, null: false
    add_column :time_off_requests, :final_decision, :integer, default: 0, null: false
  end
end
