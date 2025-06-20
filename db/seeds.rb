#Authors: Matthew Heering & Will Pevytoe
#Description: seed file to populate the DB with test data. 
#Date: 6/18/25
require 'faker'

puts "Resetting database..."

FiscalYearEmployee.destroy_all
FiscalYear.destroy_all
Employee.update_all(supervisor_id: nil)
Employee.destroy_all
Company.destroy_all

puts "All records deleted."

puts "Creating company..."
company = Company.first_or_create!(name: "Your Company Name")

puts "Creating fiscal years..."
fiscal_years = []
5.times do |i|
  start_date = Date.new(2020 + i, 7, 1)
  end_date = Date.new(2021 + i, 6, 30)
  fiscal_years << FiscalYear.create!(start_date: start_date, end_date: end_date)
end

puts "Creating administrators..."
admin1 = Employee.create!(
  first_name: "Mandy",
  last_name: "Heering",
  email: "mandy.heering@gmail.com",
  password: "Password123!",
  hire_date: Date.new(2019, 8, 1),
  is_supervisor: true,
  is_administrator: true
)

admin2 = Employee.create!(
  first_name: "Alex",
  last_name: "Johnson",
  email: "alex.johnson@example.com",
  password: "Password123!",
  hire_date: Date.new(2018, 5, 15),
  is_supervisor: false,
  is_administrator: true
)

puts "Creating 10 supervisors"
supervisors = []
10.times do
  supervisors << Employee.create!(
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    email: Faker::Internet.unique.email,
    password: "Password123!",
    hire_date: Faker::Date.between(from: '2018-01-01', to: '2020-12-31'),
    is_supervisor: true,
    is_administrator: false
  )
end

puts "Creating 100 employees (10 per supervisor)"
employees = []
supervisors.each do |supervisor|
  10.times do
    employees << Employee.create!(
      first_name: Faker::Name.first_name,
      last_name: Faker::Name.last_name,
      email: Faker::Internet.unique.email,
      password: "Password123!",
      hire_date: Faker::Date.between(from: '2019-01-01', to: '2023-12-31'),
      supervisor_id: supervisor.id,
      is_supervisor: false,
      is_administrator: false
    )
  end
end

all_employees = [admin1, admin2] + supervisors + employees

puts "Assigning all employees to each fiscal year"
all_employees.each do |employee|
  fiscal_years.each do |fy|
    FiscalYearEmployee.create!(employee: employee, fiscal_year: fy)
  end
end

puts "Seeding complete."