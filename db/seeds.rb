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
  is_supervisor: true,
  is_administrator: false
)

admin3 = Employee.create!(
  first_name: "Mike",
  last_name: "Orsega",
  email: "e ",
  password: "Password123!",
  hire_date: Date.new(2017, 5, 15),
  is_supervisor: true,
  is_administrator: true
)

all_admins = [ admin1, admin2, admin3 ]
all_admins.each do |admin|
  fiscal_years.each do |fy|
    FiscalYearEmployee.find_or_create_by!(
      employee:    admin,
      fiscal_year: fy
    )
  end
end

requesters = Employee
  .where(is_administrator: false, is_supervisor: false)
  .joins(:fiscal_year_employees)
  .distinct
  .to_a

supervisors = all_admins.dup

puts "Creating 10 supervisors"
10.times do
  first = Faker::Name.first_name
  last  = Faker::Name.last_name

  sup = Employee.create!(
    first_name:       first,
    last_name:        last,
    email:            "#{first.downcase}.#{last.downcase}@example.com",
    password:         "Password123!",
    hire_date:        Faker::Date.between(from: '2018-01-01', to: '2020-12-31'),
    is_supervisor:    true,
    is_administrator: false
  )
  supervisors << sup
end



puts "Creating 100 employees (10 per supervisor)"
employees = []
supervisors.each do |supervisor|
  10.times do
    first = Faker::Name.first_name
    last  = Faker::Name.last_name
    hire_date = Faker::Date.between(from: '2019-01-01', to: '2023-12-31')

    emp = Employee.create!(
      first_name:    first,
      last_name:     last,
      email:         "#{first.downcase}.#{last.downcase}@example.com",
      password:      "Password123!",
      hire_date:        hire_date,
      termination_date: nil,
      supervisor_id: supervisor.id,
      is_supervisor: false,
      is_administrator: false
    )
    employees << emp

    fiscal_years.each do |fy|
      FiscalYearEmployee.find_or_create_by!(employee: emp, fiscal_year: fy)
    end
  end
end

all_employees = (all_admins + employees)

employees.sample(10).each do |emp|
  emp.update!(
    termination_date: emp.hire_date + rand(1..365).days
  )
end




puts "Creating some random TimeOffRequests"

reasons   = %w[pto vacation jury_duty bereavement unpaid other]
decisions = %w[approved denied pending]

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
  employee   = requesters.sample
  supervisor = supervisors.find { |s| s.id == employee.supervisor_id } || supervisors.sample
  fiscal_year = fiscal_years.sample

  fye = FiscalYearEmployee.find_or_create_by!(
    employee:    employee,
    fiscal_year: fiscal_year
  )

    request_date = Faker::Date.between(
    from: fiscal_year.start_date,
    to:   fiscal_year.end_date
  )

  desired_length = rand(1..5)
  days_left      = (fiscal_year.end_date - request_date).to_i + 1
  num_days       = [ desired_length, days_left ].min

  block_start = request_date

  request_status = statuses.sample
  final_decision = request_status == 'decided' ? final_decisions.sample : 'undecided'

  request = TimeOffRequest.create!(
    fiscal_year_employee_id:  fye.id,
    submitted_by_id:          employee.id,
    supervisor_id:            supervisor.id,
    request_date:             block_start,
    reason:                   reasons.sample,
    comment:                  Faker::Lorem.sentence(word_count: 8),
    is_fmla:                  [ true, false ].sample,
    supervisor_decision_date: block_start + rand(1..5).days,
    final_decision_date:      (request_status == 'decided' ? (block_start + rand(6..10).days) : nil),
    request_status:           TimeOffRequest.request_statuses[request_status],
    final_decision:           TimeOffRequest.final_decisions[final_decision]
  )

  num_days.times do |days_off|
    request.dates.create!(
      date: block_start + days_off.days,
      amount: [ 0.5, 1.0 ].sample,
      was_taken: [ true, false ].sample,
      decision:  decisions.sample
    )
  end
end




puts "Creating 3 TimeOffRequests for every FiscalYearEmployee of every employee…"

Employee.all.each do |employee|
  employee.fiscal_year_employees.each do |fye|
    3.times do
      start_date   = Faker::Date.between(
                       from: fye.fiscal_year.start_date,
                       to:   fye.fiscal_year.end_date
                     )

      desired_len  = rand(1..5)
      days_left    = (fye.fiscal_year.end_date - start_date).to_i + 1
      num_days     = [ desired_len, days_left ].min

      request = TimeOffRequest.create!(
        fiscal_year_employee_id: fye.id,
        submitted_by_id:         employee.id,
        supervisor_id:           (employee.supervisor_id || Employee.where(is_supervisor: true).sample.id),
        request_date:            start_date,
        reason:                  reasons.sample,
        comment:                 Faker::Lorem.sentence(word_count: 6),
        is_fmla:                 [ true, false ].sample,
        supervisor_decision_date: start_date + rand(1..5).days,
        final_decision_date:     nil,
        request_status:          statuses.index(statuses.sample),
        final_decision:          final_decisions.index(final_decisions.sample)
      )

      num_days.times do |i|
        request.dates.create!(
          date:      start_date + i.days,
          amount:    [ 0.5, 1.0 ].sample,
          was_taken: false,
          decision:  decisions.index(decisions.sample)
        )
      end
    end
  end
end

puts "✅ Finished creating 3 TimeOffRequests for every FiscalYearEmployee."
puts "Seeding complete."
