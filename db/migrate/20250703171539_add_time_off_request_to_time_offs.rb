class AddTimeOffRequestToTimeOffs < ActiveRecord::Migration[8.0]
  def change
    add_reference :time_offs, :time_off_request, null: false, foreign_key: true
  end
end
