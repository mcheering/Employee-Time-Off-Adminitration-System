# Authors: William Pevytoe, Terry Thompson
# Date: 2024-06-20
# Description: Model of a person who supervises other employee.  This person can approve and deny
# time-off requests.
class Supervisor < ApplicationRecord
  self.table_name = "employees"

  # Author: Terry Thompson
  # Date: 2024-06-20
  # Description: Displays the supervisor's full name
  def name
    "#{first_name} #{last_name}"
  end

  # Author: Terry Thompson
  # Date: 2024-06-20
  # Description: Retrieves all supervisors from the employees table
  def self.all_supervisors
    where(is_supervisor: true).select(:id, :first_name, :last_name)
  end
end
