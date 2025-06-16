require 'faker'

puts "Resetting database..."

Company.destroy_all
Employee.destroy_all
FiscalYear.destroy_all

puts "Creating company..."
company = Company.create!(name: "Demo Company")

puts "Creating administrator (also a supervisor)..."
admin = Employee.create!(
  first_name: "Alice",
  last_name: "Admin",
  email: "admin@example.com",
  password: "SecurePass123!",
  is_administrator: true,
  is_supervisor: true,
  company: company
)

puts "Creating second supervisor..."
supervisor2 = Employee.create!(
  first_name: "Bob",
  last_name: "Supervisor",
  email: "bob@example.com",
  password: "SecurePass123!",
  is_supervisor: true,
  is_administrator: false,
  company: company
)

puts "Creating employees under administrator..."
4.times do
  Employee.create!(
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    email: Faker::Internet.unique.email,
    password: "Password123!",
    supervisor_id: admin.id,
    company: company
  )
end

puts "Creating employees under second supervisor..."
4.times do
  Employee.create!(
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    email: Faker::Internet.unique.email,
    password: "Password123!",
    supervisor_id: supervisor2.id,
    company: company
  )
end

puts "✅ Seed complete."