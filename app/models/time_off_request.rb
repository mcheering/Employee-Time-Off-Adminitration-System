# Author: Terry Thompson
# Date: 6/24/2025
# Description: Model of an employee's request to take time off.  The request
# can be submitted either before or after days taken off (e.g., employee was
# unexpectedly sick, the request may be submitted after the employee took time
# off).
class TimeOffRequest < ApplicationRecord
  belongs_to :fiscal_year_employee
  belongs_to :supervisor, class_name: "Employee", foreign_key: "supervisor_id"

  has_many :dates, class_name: "TimeOff", foreign_key: "time_off_request_id", dependent: :destroy

  delegate :employee_name,       to: :fiscal_year_employee, prefix: false
  delegate :fiscal_year_caption, to: :fiscal_year_employee, prefix: false
  delegate :name,                to: :supervisor,           prefix: true
   delegate :submitted_by_name,   to: :users,                prefix: true

  enum :reason, { pto: 0, vacation: 1, jury_duty: 2, bereavement: 3,  unpaid: 4, other: 5 }

  validates :fiscal_year_employee_id, presence: true
  validates :supervisor_id, presence: true
  validates :reason, presence: true
  validates :request_date, presence: true
  validates :submitted_by_id, presence: true
  validates :is_fmla, inclusion: { in: [ true, false ] }

  # Author: Terry Thompson
  # Date: 6/24/2025
  # Description: Identifies the status of the request.
  def status
    if final_decision_date.present?
      "decided"
    elsif additional_information_date.present? && information_received_date.nil?
      "information needed"
    elsif supervisor_decision_date.present?
      "supervisor reviewed"
    else
      "pending"
    end
  end

  # Author: Terry Thompson
  # Date: 6/24/2025
  # Description: Identifies the first date on a time off request.
  def from_date
    dates.minimum(:date)
  end

  # Author: Terry Thompson
  # Date: 6/24/2025
  # Description: Identifies the last date on a request for time off.
  def to_date
    dates.maximum(:date)
  end

  # Author: Terry Thompson
  # Date: 6/24/2025
  # Description: Identifies the person who submitted the request.  Can be
  # the employee, the supervisor, or the administrator.
  def submitted_by_name
    employee = Employee.find(self.submitted_by_id)
    employee.name
  end
end
