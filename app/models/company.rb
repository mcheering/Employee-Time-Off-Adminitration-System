# Authors: William Pevytoe, Terry Thompson
# Date: 2024-06-20
# Description: Model of a company.
class Company < ApplicationRecord
  validates :name, presence: true, uniqueness: true
end
