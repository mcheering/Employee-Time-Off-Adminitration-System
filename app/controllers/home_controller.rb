# Author: Matthew Heering
# Description: Sends data from the selector view to render the correct dashboard
# Date: 7/5/25
class HomeController < ApplicationController
      before_action :authenticate_employee!

      def selector
        if current_employee.is_administrator || current_employee.is_supervisor
          render :selector
        else
          redirect_to employee_path(current_employee)
        end
      end
end
