Rails.application.routes.draw do
  get    "employees",          to: "employees#index",  as: :employees
  post   "employees",          to: "employees#create"
  get    "employees/new",      to: "employees#new",    as: :new_employee
  get    "employees/:id/edit", to: "employees#edit",   as: :edit_employee
  get    "employees/:id",      to: "employees#show",   as: :employee
  patch  "employees/:id",      to: "employees#update"
  put    "employees/:id",      to: "employees#update"
  delete "employees/:id",      to: "employees#destroy"

  resources :administrators, only: [ :index ]


  resources :fiscal_years, only: [ :create, :update ] do
    member do
      patch :toggle_status
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
  get "/admin/dashboard", to: "administrators#dashboard", as: "admin_dashboard"

  root "administrators#dashboard"

  devise_for :employees
  resources :supervisors, only: %i[index show] do 
    member do
      get :calendar
      get :employee_records
    end
  end  
end
