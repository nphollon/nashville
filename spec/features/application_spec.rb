require 'spec_helper'
require_relative '../../app/application.rb'

describe "Playing a game", :js => :true do
  specify "winning a round" do
    Random.any_instance.stub(:rand).and_return(1)

    visit '/'
    page.should have_selector('#score', text: /^0$/)

    fill_in "wager", with: 5
    find('#action').click
    page.should have_selector('#score', text: /^5$/)
  end
end
