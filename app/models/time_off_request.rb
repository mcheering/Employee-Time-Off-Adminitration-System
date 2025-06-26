class TimeOffRequest < ApplicationRecord
  belongs_to :fiscal_year_employee
  belongs_to :supervisor, class_name: "Employee", foreign_key: "supervisor_id"

  has_many :dates, class_name: "TimeOff", foreign_key: "time_off_request_id", dependent: :destroy

  delegate :name,                to: :fiscal_year_employee, prefix: :fiscal_year_employee
  delegate :fiscal_year_caption, to: :fiscal_year,          prefix: :fiscal_year
  delegate :supervisor_name,     to: :supervisor,           prefix: true

  enum time_off_reason: { pto: 0, vacation: 1, jury_duty: 2, bereavement: 3,  unpaid: 4, other: 5 }
  enum request_status: { pending: 0, waiting_information: 1, supervisor_approved: 2, approved: 3, denied: 4, withdrawn: 5 }
  enum time_off_decision: { none: 0, approved: 1, denied: 2 }

  def status
  end

  def from_date
  end

  def to_date
  end
end
