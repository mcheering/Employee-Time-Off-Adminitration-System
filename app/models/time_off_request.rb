class TimeOffRequest < ApplicationRecord
  belongs_to :fiscal_year_employee
  belongs_to :supervisor, class_name: "Employee", foreign_key: "supervisor_id"

  has_many :dates, class_name: "TimeOff", foreign_key: "time_off_request_id", dependent: :destroy

  delegate :name,                to: :fiscal_year_employee, prefix: :fiscal_year_employee
  delegate :fiscal_year_caption, to: :fiscal_year_employee, prefix: :fiscal_year_employee
  delegate :supervisor_name,     to: :supervisor,           prefix: true
  delegate :submitted_by_name,   to: :users,                prefix: true

  # enum time_off_reason: { pto: 0, vacation: 1, jury_duty: 2, bereavement: 3,  unpaid: 4, other: 5 }
  # enum request_status: { pending: 0, waiting_information: 1, supervisor_reviewed: 2, decided: 3 }

  validates :fiscal_year_employee_id, presence: true
  validates :supervisor_id, presence: true
  validates :time_off_reason, presence: true
  validates :request_date, presence: true
  validates :submitted_by, presence: true
  validates :is_fmla, inclusion: { in: [ true, false ] }

  def status
    if final_decision_date.present?
      :decided
    elsif additional_information_date.present?
      :waiting_information
    elsif supervisor_decision_date.present?
      :supervisor_reviewed
    else
      :pending
    end
  end

  def status_caption
    I18n.t("time_off_request.statuses.#{status}")
  end

  def reason_caption
    I18n.t("time_off_request.reasons.#{time_off_reason}")
  end

  def from_date
    dates.minimum(:date)
  end

  def to_date
    dates.maximum(:date)
  end
end
