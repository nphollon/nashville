require 'spec_helper'
require_relative '../../app/application.rb'

describe "Playing a game", :js => :true do
  specify "winning a round" do
    Random.any_instance.stub(:rand).and_return(1)

    visit '/'
    find('.button').click
    page.should have_selector('#score-player', text: /^0$/)
    page.should have_selector("#score-opponent", text: /^0$/)

    fill_in "wager", with: 5
    find('#action').click
    page.should have_selector('#score-player', text: /^5$/)
    page.should have_selector("#score-opponent", text: /^-5$/)
  end
end

# These tests are pending; to be converted to jasmine
describe "Game page", :js => :true do
  before { visit '/game' }

  subject { page }

  describe "initial state" do
    xit { should have_content("Hello!") }
    xit { should have_selector("#action", text: "Play") }
    xit { should have_selector("#score-player", text: "0") }
    xit { should have_selector("#score-opponent", text: "0") }
    xit { should have_field("wager") }
    xit { should_not have_content("You have won") }
    xit { should_not have_content("You have lost") }
  end

  describe "default wager" do
    xit "links to a 'You have won' screen and increments score if next generated value is a 1" do
      Random.any_instance.stub(:rand).and_return(1)
      find('#action').click

      page.should have_content("You have won")
      page.should_not have_content("Hello!")
      page.should have_selector("#score-player", text: /^1$/)
      page.should have_selector("#score-opponent", text: /^-1$/)
      page.should have_selector("#action", text: "Reset")
      find('#action').click
      
      page.should have_content("Hello!")
      page.should have_selector("#action", text: "Play")
      page.should_not have_content("You have won")

      find('#action').click
      page.should have_selector("#score-player", text: /^2$/)
    end

    xit "links to a 'You have lost' screen and decrements score if next generated value is a 0" do
      Random.any_instance.stub(:rand).and_return(0)
      find('#action').click

      page.should have_content("You have lost")
      page.should_not have_content("Hello!") 
      page.should have_selector("#score-player", text: /^-1$/)
      page.should have_selector("#score-opponent", text: /^1$/)
      page.should have_selector("#action", text: "Reset")
      find('#action').click
      
      page.should have_content("Hello!")
      page.should have_selector("#action", text: "Play")
      page.should_not have_content("You have lost")

      find('#action').click
      page.should have_selector("#score-player", text: /^-2$/)
    end
  end

  describe "valid non-default wager" do
    xit "Awards the wager amount if next generated value is a 1" do
      Random.any_instance.stub(:rand).and_return(1)
      fill_in "wager", with: 5
      find('#action').click
      page.should have_selector('#score-player', text: /^5$/)
      page.should have_selector("#score-opponent", text: /^-5$/)
    end


    xit "Deducts the wager amount if next generated value is a 0" do
      Random.any_instance.stub(:rand).and_return(0)
      fill_in "wager", with: 5
      find('#action').click
      page.should have_selector('#score-player', text: /^-5$/)
      page.should have_selector('#score-opponent', text: /^5$/)
    end
  end

  describe "invalid wager" do
    xit "Sets the wager to 1 if wager is 0" do
      fill_in "wager", with: "0"
      find('#action').click
      page.should have_selector('#score-player', text: '1')
    end

    # A bug in Poltergeist prevents this test from passing      
    xit "Sets the wager to 1 if wager is negative" do
      fill_in "wager", with: "-5"
      find('#action').click
      page.should have_selector('#score-player', text: '1')
    end

    xit "Sets the wager to 1 if wager is not a number" do
      fill_in "wager", with: "a salmon"
      find('#action').click
      page.should have_selector('#score-player', text: '1')
    end
  end
end