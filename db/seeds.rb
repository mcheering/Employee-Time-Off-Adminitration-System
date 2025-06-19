  # Author: William Pevytoe and Matthew Heering
  # Date: 6/17/2025
  # Fill Database with test data

require 'faker'

puts "Resetting database..."

puts "Creating fiscal years..."
fiscal_years = []
5.times do |i|
  start_date = Date.new(2020 + i, 7, 1)
  end_date = Date.new(2021 + i, 6, 30)
  fiscal_years << FiscalYear.create!(start_date: start_date, end_date: end_date)
end

puts "Creating administrator..."
admin = Employee.create!(
  first_name: "Mandy",
  last_name: "Heering",
  email: "mandy.heering@gmail.com",
  password: "Password123!",
  hire_date: Date.new(2019, 8, 1),
  is_supervisor: true,
  is_administrator: true
)

puts "Creating second supervisor..."
supervisor = Employee.create!(
  first_name: "Matthew",
  last_name: "Heering",
  email: "matthew.heering01@gmail.com",
  password: "Password123!",
  hire_date: Date.new(2020, 8, 1),
  is_supervisor: true,
  is_administrator: false
)

puts "Creating employees..."
employees = []

4.times do
  employees << Employee.create!(
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    email: Faker::Internet.unique.email,
    password: "Password123!",
    hire_date: Faker::Date.between(from: '2019-01-01', to: '2022-12-31'),
    supervisor_id: admin.id
  )
end

4.times do
  employees << Employee.create!(
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    email: Faker::Internet.unique.email,
    password: "Password123!",
    hire_date: Faker::Date.between(from: '2019-01-01', to: '2022-12-31'),
    supervisor_id: supervisor.id
  )
end

employees << admin
employees << supervisor

puts "Assigning employees to each fiscal year..."
employees.each do |employee|
  fiscal_years.each do |fy|
    FiscalYearEmployee.create!(employee: employee, fiscal_year: fy)
  end
end

puts "✅ Seeding complete!"