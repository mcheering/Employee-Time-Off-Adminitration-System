# Authors: William Pevytoe, Terry Thompson
# Date: 2024-06-20
# Description: Model of a person who works for the company.
class Employee < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable


  validates :first_name, :last_name, :hire_date, :is_administrator, :is_supervisor, :email, presence: true
  validates :email, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  has_many :fiscal_year_employees
  has_many :fiscal_years, through: :fiscal_year_employees

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
end
