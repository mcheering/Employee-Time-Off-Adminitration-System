class Administrator < ApplicationRecord
  self.table_name = "employees"

  def self.all_administrators
    where(is_administrator: true).select(:id, :first_name, :last_name)
  end
end
