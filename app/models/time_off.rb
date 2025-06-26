class TimeOff < ApplicationRecord
  belongs_to :time_off_request, class_name: "TimeOffRequest", foreign_key: "time_off_request_id"

  validates :date, presence: true
  validates :time_off_request_id, presence: true

  delegate :fiscal_year_employee_name, to: :time_off_request, prefix: true
  delegate :supervisor_name, to: :time_off_request, prefix: true

  def self.for_request(request_id)
    where(time_off_request_id: request_id)
  end
end
