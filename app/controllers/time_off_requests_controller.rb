class TimeOffRequestsController < ApplicationController
      before_action :set_employee
      before_action :set_request, only: [:show, :edit, :update]
    
      def new
            @request = TimeOffRequest.new
            @fiscal_years = @employee.fiscal_year_employees.includes(:fiscal_year).map do |fye|
              {
                id: fye.fiscal_year.id,
                year: fye.fiscal_year.start_date.year # Make sure start_date exists
              }
            end
            render :form
      end
          
    
      def create
            @request = TimeOffRequest.new(request_params)
            @request.fiscal_year_employee = FiscalYearEmployee.find_by(employee: @employee, fiscal_year_id: params[:fiscal_year_id])
          
            if @request.save
              respond_to do |format|
                format.html { redirect_to employee_path(@employee) }
                format.json { render json: @request, status: :created }
              end
            else
              respond_to do |format|
                format.html { render :form }
                format.json { render json: { errors: @request.errors.full_messages }, status: :unprocessable_entity }
              end
            end
          end
    
      def show
        render :show
      end
    
      def edit
            @fiscal_years = @employee.fiscal_year_employees.includes(:fiscal_year).map do |fye|
              {
                id: fye.fiscal_year.id,
                year: fye.fiscal_year.start_date.year
              }
            end
            render :form, layout: true
      end
    
      def update
            if @request.update(request_params)
              respond_to do |format|
                format.html { redirect_to employee_path(@employee) }
                format.json { render json: @request, status: :ok }
              end
            else
              respond_to do |format|
                format.html { render :form }
                format.json { render json: { errors: @request.errors.full_messages }, status: :unprocessable_entity }
              end
            end
      end
    
      private
    
      def set_employee
        @employee = Employee.find(params[:employee_id])
      end
    
      def set_request
        @request = TimeOffRequest.find(params[:id])
      end
    
      def request_params
            params.require(:time_off_request).permit(
              :request_date,
              :supervisor_decision_date,
              :reason,
              :is_fmla,
              :comment
            )
          end
    end