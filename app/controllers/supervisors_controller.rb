# Author: Matthew Heering
# Description: sends data fro the supervisors model to the react views.
# Date: 6/18/25
class SupervisorsController < ApplicationController
  def index
    @supervisors = Supervisor.all_supervisors()
  end
end
