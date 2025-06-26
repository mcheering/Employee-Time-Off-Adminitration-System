# Authors: Matthew Heering & Will Pevytoe
# Description: seed file to populate the DB with test data.
# Date: 6/18/25
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

all_employees = [ admin1, admin2 ] + supervisors + employees


puts "TimeOffRequests"

TimeOffRequest.destroy_all
TimeOff.destroy_all
requestees = all_employees.reject(&:is_administrator)

20.times do
  employee = requestees.sample
  supervisor = supervisors.find { |s| s.id == emp.supervisor_id } || supervisors.sample
  fiscal_year  = fiscal_years.sample
  request_date = Faker::Date.between(from: fiscal_years.start_date, to: fiscal_years.end_date)

   request = TimeOffRequest.create!(
    employee:                 employee,
    submitted_by:             supervisor,
    supervisor:               supervisor,
    fiscal_year:              fiscal_year,
    request_date:             req_date,
    time_off_type:            %w[requested approved denied].sample,
    reason:                   reasons.sample,
    comment:                  Faker::Lorem.sentence(word_count: 8),
    is_final:                 [true, false].sample,
    final_decision:           %w[approved denied].sample,
    supervisor_decision_date: req_date + rand(1..5).days
  )

  rand(1..4).times do
    d = Faker::Date.between(from: [employee.hire_date, fiscal_year.start_date].max, to: fiscal_year.end_date)
    req.time_offs.create!(
      date:     d,
      reason:   request.reason,
      time_off: [0.5, 1.0].sample,
      taken:    [true, false].sample,
      is_paid:  [true, false].sample,
      is_fmla:  [false, true].sample,
      decision: %w[approved denied pending].sample
    )
  end
end

puts "Seeding complete."
