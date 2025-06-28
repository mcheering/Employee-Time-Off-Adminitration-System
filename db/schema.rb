# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_06_26_105205) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_companies_on_name", unique: true
  end

  create_table "employees", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "supervisor_id"
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.date "hire_date", null: false
    t.date "termination_date"
    t.boolean "is_supervisor", default: false
    t.boolean "is_administrator", default: false
    t.index ["email"], name: "index_employees_on_email", unique: true
    t.index ["reset_password_token"], name: "index_employees_on_reset_password_token", unique: true
    t.index ["supervisor_id"], name: "index_employees_on_supervisor_id"
  end

  create_table "fiscal_year_employees", force: :cascade do |t|
    t.bigint "employee_id", null: false
    t.bigint "fiscal_year_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_id"], name: "index_fiscal_year_employees_on_employee_id"
    t.index ["fiscal_year_id"], name: "index_fiscal_year_employees_on_fiscal_year_id"
  end

  create_table "fiscal_years", force: :cascade do |t|
    t.date "start_date", null: false
    t.date "end_date", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_open", default: true, null: false
  end

  create_table "time_off_requests", force: :cascade do |t|
    t.integer "fiscal_year_employee_id", null: false
    t.integer "supervisor_id", null: false
    t.integer "submitted_by", null: false
    t.date "request_date", null: false
    t.integer "reason", null: false
    t.boolean "is_fmla", null: false
    t.string "decision_date"
    t.string "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "time_offs", force: :cascade do |t|
    t.integer "request_id"
    t.float "amount"
    t.boolean "was_taken"
    t.integer "decision"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "employees", "employees", column: "supervisor_id"
  add_foreign_key "fiscal_year_employees", "employees"
  add_foreign_key "fiscal_year_employees", "fiscal_years"
end
