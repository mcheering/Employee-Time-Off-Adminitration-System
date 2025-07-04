class TimeOff < ApplicationRecord
  belongs_to :time_off_request, class_name: "TimeOffRequest", foreign_key: "time_off_request_id"

  after_initialize :set_default_decision, :set_default_was_taken

  validates :date, presence: true
  validates :time_off_request_id, presence: true
  validates :was_taken, inclusion: { in: [ true, false ] }

  delegate :fiscal_year_employee_name, to: :time_off_request, prefix: true
  delegate :supervisor_name, to: :time_off_request, prefix: true
  delegate :reason, to: :time_off_request, prefix: false
  
  enum :decision,  { pending: 0, approved: 1, denied: 2 }

  # Author: Terry Thompson
  # Date: 6/27/2025
  # Description: Class method to retrieve all time_off instances for a certain time_off request id.
  def self.for_request(request_id)
    where(time_off_request_id: request_id)
  end

  # Author: Terry Thompson
  # Date: 6/27/2025
  # Description: a string that identifies the decision for the time off date
  def decision_caption
    decision
  end

  private
  def set_default_decision
    self.decision ||= :pending
  end

  def set_default_was_taken
    self.was_taken ||= :true
  end
end
