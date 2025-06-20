class AdministratorTest < ActiveSupport::TestCase
  # Terry Thompson
  # Date: 6/20/2025
  test "name returns full name of administrator" do
    admin = Administrator.new(first_name: "John", last_name: "Doe")
    assert_equal "John Doe", admin.name
  end

  # Terry Thompson
  # Date: 6/20/2025
  # Note: employees.yml contains one administrator
  test "all_administrators returns all administrators" do
    assert_equal 1, Administrator.all_administrators.size
  end
end
