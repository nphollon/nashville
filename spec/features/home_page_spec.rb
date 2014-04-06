require 'spec_helper'
require_relative '../../app/application.rb'

describe "Home page", :type => :feature, :js => true do
  before { visit '/' }
  subject { page }

  xit { should have_selector("h2", text: "Gudrun is ready to play.") }
  xit { should have_selector(".button", text: "Have a Seat") }

  xit "should link to game page" do
    find('.button').click
    current_path.should == '/game'
  end
end