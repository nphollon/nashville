require 'rspec/core/rake_task'
require 'jasmine'

task :default => :test

task :test => [ :"jasmine:ci", :spec ]

RSpec::Core::RakeTask.new(:spec)

load 'jasmine/tasks/jasmine.rake'