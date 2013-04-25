require 'spec_helper'
require_relative '../app/hello.rb'

describe "Application", :type => :feature do
  describe "/" do
    before { visit '/' }

    it "has a greeting" do
      page.should have_content("Hello!")
    end

    it "links to a 'You have won' screen" do
      click_link 'Deal'
      current_path.should == '/win'
    end
  end

  describe "/win" do
    before { visit '/win' }

    it "has a message of congratulation" do
      page.should have_content("You have won")
    end

    it "links to home page" do
      click_link 'OK'
      current_path.should == '/'
    end
  end
end