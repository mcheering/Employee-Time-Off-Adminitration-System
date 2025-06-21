class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  self.table_name = "employees"

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  before_validation :set_full_name

  #  validates :first_name, :last_name, :email, presence: true
  validates :email, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
end
