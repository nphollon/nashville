require 'capybara'
require 'capybara/rspec'
require 'capybara/poltergeist'
require_relative '../app/application'

ENV['RACK_ENV'] = 'test'

require 'sinatra'

RSpec.configure do |config|

  config.treat_symbols_as_metadata_keys_with_true_values = true
  config.run_all_when_everything_filtered = true
  config.filter_run :focus
  config.include Capybara::DSL
  Capybara.app = Application
  Capybara.javascript_driver = :poltergeist

  config.order = 'random'
end