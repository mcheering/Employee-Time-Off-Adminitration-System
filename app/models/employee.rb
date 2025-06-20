# Authors: William Pevytoe, Terry Thompson
# Date: 2024-06-20
# Description: Model of a person who works for the company.
class Employee < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  after_initialize :set_default_is_administrator, :set_default_is_supervisor
  after_create :create_fiscal_year_employees

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :fiscal_years, through: :fiscal_year_employees

  validates :first_name, :last_name, :hire_date, :email, presence: true
  validates :is_administrator, :is_supervisor, inclusion: { in: [ true, false ] }
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
  def create_fiscal_year_employees
    FiscalYear.all.each do |fiscal_year|
      if hire_date <= fiscal_year.end_date && not FiscalYearEmployee.exists?(fiscal_year: fiscal_year, employee: self)
        FiscalYearEmployee.create(fiscal_year: fiscal_year, employee: self)
      end
    end
  end

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
