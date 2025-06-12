class SupervisorsController < ApplicationController
  def index
    @supervisors = Supervisor.all_supervisors()
  end
end
