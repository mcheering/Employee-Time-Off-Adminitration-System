class TimeOff < ApplicationRecord
  belongs_to :time_off_request, class_name: "TimeOffRequest", foreign_key: "time_off_request_id"

  validates :date, presence: true
  validates :time_off_request_id, presence: true
  validates :was_taken, inclusion: { in: [ true, false ] }

  delegate :fiscal_year_employee_name, to: :time_off_request, prefix: true
  delegate :supervisor_name, to: :time_off_request, prefix: true

  enum :time_off_decision,  { none: 0, approved: 1, denied: 2 }

  def self.for_request(request_id)
    where(time_off_request_id: request_id)
  end

  def decision_caption
    I18n.t("time_off.decision.#{time_off_decision}")
  end
end
