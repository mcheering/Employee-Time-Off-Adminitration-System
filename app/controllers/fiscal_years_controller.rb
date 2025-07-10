# Author: Matthew Heering
# Description: Fiscal year controller to manage data sent to and from the view
# Date: 6/15/25 (updated)

class FiscalYearsController < ApplicationController
  before_action :authorize_admin!

  def create
    fiscal_year = FiscalYear.new(fiscal_year_params)
    if fiscal_year.save
      render json: fiscal_year.as_json(methods: [ :caption ]), status: :created
    else
      render json: fiscal_year.errors, status: :unprocessable_entity
    end
  end

  def update
    fiscal_year = FiscalYear.find(params[:id])
    if fiscal_year.update(fiscal_year_params)
      render json: fiscal_year.as_json(methods: [ :caption ]), status: :ok
    else
      render json: fiscal_year.errors, status: :unprocessable_entity
    end
  end

  private

  def fiscal_year_params
    params.require(:fiscal_year).permit(:start_date, :end_date)
  end
end
