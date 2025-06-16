require 'faker'

puts "Resetting database..."

FiscalYearEmployee.destroy_all
FiscalYear.destroy_all
Employee.destroy_all
Company.destroy_all

puts "Creating company..."
company = Company.create!(name: "Demo Company")

puts "Creating administrator (also a supervisor)..."
admin = Employee.create!(
  first_name: "Alice",
  last_name: "Admin",
  email: "admin@example.com",
  password: "SecurePass123!",
  hire_date: Date.new(2020, 1, 1),
  is_administrator: true,
  is_supervisor: true
)

puts "Creating second supervisor..."
supervisor2 = Employee.create!(
  first_name: "Bob",
  last_name: "Supervisor",
  email: "bob@example.com",
  password: "SecurePass123!",
  hire_date: Date.new(2021, 5, 10),
  is_supervisor: true
)

puts "Creating employees under administrator..."
4.times do
  Employee.create!(
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    email: Faker::Internet.unique.email,
    password: "Password123!",
    hire_date: Faker::Date.between(from: 2.years.ago, to: Date.today),
    supervisor_id: admin.id
  )
end

puts "Creating employees under second supervisor..."
4.times do
  Employee.create!(
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    email: Faker::Internet.unique.email,
    password: "Password123!",
    hire_date: Faker::Date.between(from: 2.years.ago, to: Date.today),
    supervisor_id: supervisor2.id
  )
end

puts "✅ Seed data created successfully."