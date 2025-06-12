json.extract! employee, :id, :first_name, :last_name, :email, :encrypted_password, :hire_date, :termination_date, :is_administrator, :is_supervisor, :supervisor_id, :created_at, :updated_at
json.url employee_url(employee, format: :json)
