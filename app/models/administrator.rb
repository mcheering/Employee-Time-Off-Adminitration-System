# Authors: William Pevytoe, Terry Thompson
# Date: 2024-06-20
# Description: Model of a person who administers the application.  This person can create and manage users,
# open and close fiscal years, and perform other high-level administrative tasks.
class Administrator < ApplicationRecord
  self.table_name = "employees"

  # Author: Terry Thompson
  # Date: 2024-06-20
  # Description: Displays the administrator's full name
  def name
    "#{first_name} #{last_name}"
  end

  # Author: Terry Thompson
  # Date: 2024-06-20
  # Description: Retrieves all administrators from the employees table
  def self.all_administrators
    where(is_administrator: true).select(:id, :first_name, :last_name)
  end
end
