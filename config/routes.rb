Rails.application.routes.draw do
  get 'employees/new', to: 'employees#new', as: :new_employee

  resources :employees, except: [:new]
  resources :supervisors, only: [:index]
  resources :administrators, only: [:index]
  devise_for :users

  # Health check route
  get "up" => "rails/health#show", as: :rails_health_check

  # Root path
  root "employees#index"
end
