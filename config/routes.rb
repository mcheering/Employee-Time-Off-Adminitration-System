Rails.application.routes.draw do
  # === Devise ===
  devise_for :employees, skip: [:registrations]

  # === Admin & Dashboard ===
  resources :administrators, only: [:index]
  get "/admin/dashboard", to: "administrators#dashboard", as: "admin_dashboard"
  root "administrators#dashboard"

  # === Employees CRUD ===
  get    "employees",          to: "employees#index",  as: :employees
  post   "employees",          to: "employees#create"
  get    "employees/new",      to: "employees#new",    as: :new_employee
  get    "employees/:id/edit", to: "employees#edit",   as: :edit_employee
  get    "employees/:id",      to: "employees#show",   as: :employee
  patch  "employees/:id",      to: "employees#update"
  put    "employees/:id",      to: "employees#update"
  delete "employees/:id",      to: "employees#destroy"

  # === Time-Off Requests for employees (for self-service)
  resources :employees, only: [] do
    resources :time_off_requests, only: [:new, :create, :edit, :update, :show]
  end

  # === Fiscal Years ===
  resources :fiscal_years, only: [:create, :update] do
    member do
      patch :toggle_status
    end
  end

  # === Supervisors routes with time_off_requests nested ===
  resources :supervisors, only: [:index, :show] do 
    member do
      get :calendar
      get :employee_records
    end
  
    resources :time_off_requests, only: [:show] do
      member do
        get :manage
        patch :supervisor_decision
  
        patch 'update_date/:date_id', to: 'time_off_requests#update_date', as: :update_date
        patch 'update_all', to: 'time_off_requests#update_all', as: :update_all
      end
    end
  end

  # === Health Check ===
  get "up" => "rails/health#show", as: :rails_health_check
end