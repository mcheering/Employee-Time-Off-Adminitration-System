class SupervisorTest < ActiveSupport::TestCase
  # Terry Thompson
  # Date: 6/20/2025
  # Note: employees.yml contains one supervisor
  test "all_supervisors returns all supervisors" do
    assert_equal 1, Supervisor.all_supervisors.size
  end

  # Terry Thompson
  # Date: 6/20/2025
  # Note: employees.yml contains one supervisor
  test "Supervisor name should equal first and last name" do
    supervisor = Supervisor.new(first_name: "Jane", last_name: "Smith")
    assert_equal "Jane Smith", supervisor.name
  end
end
