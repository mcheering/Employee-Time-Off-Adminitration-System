# Authors: William Pevytoe, Terry Thompson
# Date: 2024-06-20
# Description: Model of a person who works for the company.
class Employee < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  after_initialize :set_default_is_administrator, :set_default_is_supervisor

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :fiscal_years, through: :fiscal_year_employees

  validates :first_name, :last_name, :hire_date, :is_administrator, :is_supervisor, :email, presence: true
  validates :email, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  validate :hire_date_before_termination_date

  # Author: Terry Thompson
  # Date: 2024-06-20
  # Description: Displays the employee's full name
  def name
    "#{first_name} #{last_name}"
  end

  # Author: Terry Thompson
  # Date: 2024-06-20
  # Description: Displays the supervisor's full name
  def supervisor_name
    supervisor = Employee.find_by(id: supervisor_id)
    supervisor ? supervisor.name : "none"
  end

  private
  def hire_date_before_termination_date
    if hire_date.present? && termination_date.present? && hire_date > termination_date
      errors.add(:termination_date, "must be before termination date")
    end
  end

  def set_default_is_administrator
    self.is_administrator ||= false
  end

  def set_default_is_supervisor
    self.is_supervisor ||= false
  end
end
