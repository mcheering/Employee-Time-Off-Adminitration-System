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

puts "Creating some random TimeOffRequests"

reasons   = %w[pto vacation juryDuty bereavement unpaid other]
decisions = %w[approved denied pending]

# fetch enums from the model
statuses = TimeOffRequest.request_statuses.keys
final_decisions = TimeOffRequest.final_decisions.keys - [ 'undecided' ]

requesters = Employee
  .where(is_administrator: false, is_supervisor: false)
  .joins(:fiscal_year_employees)
  .distinct
  .to_a

supervisors   = Employee.where(is_supervisor: true).to_a
fiscal_years  = FiscalYear.all.to_a

# Create 20 random requests
20.times do
  employee     = requesters.sample
  supervisor   = supervisors.find { |s| s.id == employee.supervisor_id } || supervisors.sample
  fiscal_year  = fiscal_years.sample
  request_date = Faker::Date.between(from: fiscal_year.start_date, to: fiscal_year.end_date)

  fye = FiscalYearEmployee.find_or_create_by!(
    employee_id:    employee.id,
    fiscal_year_id: fiscal_year.id
  )

  request_status = statuses.sample
  final_decision = request_status == 'decided' ? final_decisions.sample : 'undecided'

  request = TimeOffRequest.create!(
    fiscal_year_employee_id:  fye.id,
    submitted_by_id:          employee.id,
    supervisor_id:            supervisor.id,
    request_date:             request_date,
    reason:                   reasons.index(reasons.sample),
    comment:                  Faker::Lorem.sentence(word_count: 8),
    is_fmla:                  [ true, false ].sample,
    supervisor_decision_date: request_date + rand(1..5).days,
    final_decision_date:      request_status == 'decided' ? (request_date + rand(6..10).days) : nil,
    request_status:           TimeOffRequest.request_statuses[request_status],
    final_decision:           TimeOffRequest.final_decisions[final_decision]
  )

  rand(1..4).times do
    d = Faker::Date.between(
      from: [ employee.hire_date, fiscal_year.start_date ].max,
      to: fiscal_year.end_date
    )

    request.dates.create!(
      date:       d,
      amount:     [ 0.5, 1.0 ].sample,
      was_taken:  [ true, false ].sample,
      decision:   decisions.index(decisions.sample)
    )
  end
end

puts "Creating 3 TimeOffRequests for every FiscalYearEmployee of every employee…"

employees.each do |employee|
  fiscal_year_employees = FiscalYearEmployee.where(employee_id: employee.id)

  fiscal_year_employees.each do |fye|
    existing_reasons = []

    3.times do
      reason_idx = (reasons.map.with_index { |_, i| i } - existing_reasons).sample
      existing_reasons << reason_idx

      req_date = Faker::Date.between(from: fye.fiscal_year.start_date, to: fye.fiscal_year.end_date)

      request_status = statuses.sample
      final_decision = request_status == 'decided' ? final_decisions.sample : 'undecided'

      request = TimeOffRequest.create!(
        fiscal_year_employee_id:  fye.id,
        submitted_by_id:          employee.id,
        supervisor_id:            employee.supervisor_id || Employee.where(is_supervisor: true).sample.id,
        request_date:             req_date,
        reason:                   reason_idx,
        comment:                  Faker::Lorem.sentence(word_count: 6),
        is_fmla:                  [ true, false ].sample,
        supervisor_decision_date: req_date + rand(1..5).days,
        final_decision_date:      request_status == 'decided' ? (req_date + rand(6..10).days) : nil,
        request_status:           TimeOffRequest.request_statuses[request_status],
        final_decision:           TimeOffRequest.final_decisions[final_decision]
      )

      rand(1..3).times do
        day = Faker::Date.between(
          from: [ employee.hire_date, fye.fiscal_year.start_date ].max,
          to: fye.fiscal_year.end_date
        )

        request.dates.create!(
          date:       day,
          amount:     [ 0.5, 1.0 ].sample,
          was_taken:  [ true, false ].sample,
          decision:   decisions.index(decisions.sample)
        )
      end
    end
  end
end

puts "✅ Finished creating 3 TimeOffRequests for every FiscalYearEmployee."
puts "Seeding complete."
