require 'rspec/core/rake_task'

Rake.application.options.trace = false

RSpec::Core::RakeTask.new(:spec)

task :default => :spec