require 'spec_helper'
require_relative '../../app/application.rb'

describe "Application", :type => :feature, :js => true do
  describe "/" do
    before { visit '/' }

    it "has a greeting and links to a 'You have won' screen" do
      page.should have_content("Hello!")
      page.should have_selector("#action", text: "Play")
      page.should_not have_content("You have won")
      page.should_not have_content("You have lost")
    end

    it "links to a 'You have won' screen if next generated value is a 1" do
      Random.any_instance.stub(:rand).and_return(1)
      find('#action').click

      page.should_not have_content("Hello!")
      page.should have_content("You have won")
      page.should have_selector("#action", text: "Reset")
      find('#action').click
      
      page.should have_content("Hello!")
      page.should have_selector("#action", text: "Play")
      page.should_not have_content("You have won")
    end

    it "links to a 'You have lost' screen if next generated value is a 0" do
      Random.any_instance.stub(:rand).and_return(0)
      find('#action').click

      page.should_not have_content("Hello!")
      page.should have_content("You have lost")
      page.should have_selector("#action", text: "Reset")
      find('#action').click
      
      page.should have_content("Hello!")
      page.should have_selector("#action", text: "Play")
      page.should_not have_content("You have lost")
    end
  end
end