class Supervisor < ApplicationRecord
  self.table_name = "employees"

  def self.all_supervisors
    where(is_supervisor: true).select(:id, :first_name, :last_name)
  end
end
