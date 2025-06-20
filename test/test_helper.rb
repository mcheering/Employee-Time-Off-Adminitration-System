require "simplecov"
require "rails-controller-testing"
Rails::Controller::Testing.install

SimpleCov.start "rails" do
  enable_coverage :branch
  add_filter "/test/"
  add_filter "/config/"
  add_filter "/vendor/"
  add_group "Controllers", "app/controllers"
  add_group "Models", "app/models"
  add_group "Helpers", "app/helpers"
  add_group "Jobs", "app/jobs"
end

puts "Code coverage tracking is on with SimpleCov"

ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase

    fixtures :all

  end
end
