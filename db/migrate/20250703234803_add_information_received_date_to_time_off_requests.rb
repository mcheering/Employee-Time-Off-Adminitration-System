class AddInformationReceivedDateToTimeOffRequests < ActiveRecord::Migration[8.0]
  def change
    add_column :time_off_requests, :information_received_date, :datetime
  end
end
