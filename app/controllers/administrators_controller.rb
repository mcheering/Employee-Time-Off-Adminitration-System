class AdministratorsController < ApplicationController
  def index
    @administrators = Administrator.all_administrators()
  end
end
