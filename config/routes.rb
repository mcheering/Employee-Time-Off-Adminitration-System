Rails.application.routes.draw do
  get 'employees/new', to: 'employees#new', as: :new_employee

  resources :employees, except: [:new]
  resources :supervisors, only: [:index]
  resources :administrators, only: [:index]
  devise_for :users

  # Health check route
  get "up" => "rails/health#show", as: :rails_health_check

  # gets the admin dashboard
  get "/admin/dashboard", to: "administrators#dashboard", as: "admin_dashboard"
  
  # Root path
  root "employees#index"
end
