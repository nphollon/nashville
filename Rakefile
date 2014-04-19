require 'rspec/core/rake_task'

task :default => :test

task :test => [ :jasmine, :rspec ]

RSpec::Core::RakeTask.new(:rspec)

task :jasmine do
	sh "jasmine-node spec"
end