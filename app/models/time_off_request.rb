# Author: Terry Thompson
# Date: 6/24/2025
# Description: Model of an employee's request to take time off.
# The request can be submitted either before or after days taken off (e.g., employee was
# unexpectedly sick, the request may be submitted after the employee took time off).
class TimeOffRequest < ApplicationRecord
  belongs_to :fiscal_year_employee
  belongs_to :supervisor, class_name: "Employee", foreign_key: "supervisor_id"
  belongs_to :submitted_by, class_name: "Employee", foreign_key: "submitted_by_id"

  has_many :dates, class_name: "TimeOff", foreign_key: "time_off_request_id", dependent: :destroy

  delegate :employee_name,       to: :fiscal_year_employee, prefix: false
  delegate :fiscal_year_caption, to: :fiscal_year_employee, prefix: false
  delegate :name,                to: :supervisor,           prefix: true, allow_nil: true
  delegate :name,                to: :submitted_by,         prefix: true, allow_nil: true

  enum :reason, {
    pto:         0,
    vacation:    1,
    jury_duty:   2,
    bereavement: 3,
    unpaid:      4,
    other:       5
  }

  enum :request_status, {
    pending: 0,
    waiting_information: 1,
    supervisor_reviewed: 2,
    decided: 3
  }

  enum :final_decision, {
    undecided: 0,
    approved: 1,
    denied: 2
  }

  validates :fiscal_year_employee_id, presence: true
  validates :reason, presence: true
  validates :request_date, presence: true
  validates :submitted_by_id, presence: true
  validates :is_fmla, inclusion: { in: [ true, false ] }

  # Author: Terry Thompson
  # Date: 6/24/2025
  # Description: Computed human-readable current status.
  def status_caption
    if decided?
      "Final decision made: #{final_decision_caption}"
    elsif waiting_information?
      "Waiting for more information"
    elsif supervisor_reviewed?
      "Reviewed by supervisor"
    else
      "Pending"
    end
  end

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

  # Author: Matthew Heering
  # Date: 7/3/2025
  # Description: Returns the human-readable reason for the request.
  def reason_caption
    reason.to_s.humanize
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
  # Date: 7/3/2025
  # Description: Human-readable final decision.
  def final_decision_caption
    case final_decision
    when "approved" then "Approved by Admin"
    when "denied" then "Denied by Admin"
    else "Not yet decided"
    end
  end

  # Author: Terry Thompson
  # Date: 7/3/2025
  # Description: Whether the request is ready for admin final decision.
  def ready_for_final_decision?
    supervisor_reviewed? && final_decision == "undecided"
  end

  def update_status!
    breakdown = dates.group(:decision).count

    if breakdown["pending"].to_i > 0
      self.request_status = "pending"
      self.final_decision = "undecided"
    elsif breakdown["denied"].to_i > 0
      self.request_status = "decided"
      self.final_decision = "denied"
    elsif breakdown["approved"].to_i == dates.count
      self.request_status = "decided"
      self.final_decision = "approved"
    else
      self.request_status = "decided"
      self.final_decision = "undecided" # or "mixed" if you add it to `final_decision` enum
    end

    save!
  end

  def finalize!(decision:)
    transaction do
      update!(final_decision_date: Date.today)
      dates.update_all(decision: decision)
    end
  end
end
