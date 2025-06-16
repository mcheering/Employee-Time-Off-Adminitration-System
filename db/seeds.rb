require 'faker'

puts "Resetting database..."

FiscalYearEmployee.delete_all
Employee.delete_all
Company.delete_all
FiscalYear.delete_all

puts "Creating company..."
company = Company.create!(name: Faker::Company.name)

puts "Creating administrator (also a supervisor)..."
admin_supervisor = Administrator.create!(
  first_name: Faker::Name.first_name,
  last_name: Faker::Name.last_name,
  email: "admin@#{company.name.parameterize}.com",
  password: "Password123!",
  company: company
)

puts "Creating another supervisor..."
second_supervisor = Supervisor.create!(
  first_name: Faker::Name.first_name,
  last_name: Faker::Name.last_name,
  email: "supervisor2@#{company.name.parameterize}.com",
  password: "Password123!",
  company: company
)

puts "Creating 10 employees..."
employees = []

10.times do |i|
  assigned_supervisor = case i
                        when 0..3 then admin_supervisor
                        when 4..7 then second_supervisor
                        else nil
                        end

  employees << Employee.create!(
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    email: Faker::Internet.unique.email,
    password: "Password123!",
    company: company,
    supervisor: assigned_supervisor
  )
end

puts "Creating a fiscal year..."
fiscal_year = FiscalYear.create!(
  year: "2024-2025",
  start_date: Date.new(2024, 7, 1),
  end_date: Date.new(2025, 6, 30),
  open: true
)

puts "Assigning vacation and personal day balances..."
employees.each do |employee|
  FiscalYearEmployee.create!(
    employee: employee,
    fiscal_year: fiscal_year,
    vacation_days: rand(10..20),
    personal_days: rand(2..5)
  )
end

puts "Seeding complete."