class Employee < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable


  validates :email, presence: true
  validates :email, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  scope :supervisors, -> { where(is_supervisor: true).select(:id, :first_name, :last_name) }
  scope :administrators, -> { where(is_administrator: true).select(:id, :first_name, :last_name) }

  def name
    "#{first_name} #{last_name}"
  end

  def supervisor_name
    supervisor = Employee.find_by(id: supervisor_id)
    supervisor ? supervisor.name : "none"
  end
end
