# test/controllers/supervisors_controller_test.rb
require "test_helper"

class SupervisorsControllerTest < ActionController::TestCase
  # Author: William Pevytoe
  # Date: 6/18/2025
  #Testing methods in supervisor controller
  include Devise::Test::ControllerHelpers

  setup do
    # fixtures :all is already enabled in test_helper.rb
    @supervisor   = employees(:supervisor)
    @non_supervisor = employees(:one)
  end

  # Author: William Pevytoe
  # Date: 6/18/2025
  test "index loads only supervisors" do
    get :index
    assert_response :success

    sups = assigns(:supervisors)
    assert_kind_of ActiveRecord::Relation, sups
    assert_includes    sups.map(&:id), employees(:supervisor).id
    refute_includes    sups.map(&:id), employees(:one).id
  end
end
