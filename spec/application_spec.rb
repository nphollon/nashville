require 'spec_helper'
require_relative '../app/hello.rb'

describe "Application", :type => :feature do
  it "has a home page with a greeting" do
    visit '/'
    page.should have_content("Hello!")
  end
end