class AddAdminDecisionDateToTimeOffRequests < ActiveRecord::Migration[8.0]
  def change
    add_column :time_off_requests, :admin_decision_date, :datetime
  end
end
