require 'spec_helper'
require_relative '../../app/application.rb'

describe "Application", :type => :feature, :js => :true do
  describe "/" do
    before { visit '/' }

    it "has a greeting and links to a 'You have won' screen" do
      page.should have_content("Hello!")
      page.should have_selector("#action", text: "Play")
      page.should have_selector("#score", text: "0")
      page.should have_field("wager")
      page.should_not have_content("You have won")
      page.should_not have_content("You have lost")
    end

    describe "default wager" do
      it "links to a 'You have won' screen and increments score if next generated value is a 1" do
        Random.any_instance.stub(:rand).and_return(1)
        find('#action').click

        page.should_not have_content("Hello!")
        page.should have_content("You have won")
        page.should have_selector("#score", text: /^1$/)
        page.should have_selector("#action", text: "Reset")
        find('#action').click
        
        page.should have_content("Hello!")
        page.should have_selector("#action", text: "Play")
        page.should_not have_content("You have won")

        find('#action').click
        page.should have_selector("#score", text: /^2$/)
      end

      it "links to a 'You have lost' screen and decrements score if next generated value is a 0" do
        Random.any_instance.stub(:rand).and_return(0)
        find('#action').click

        page.should_not have_content("Hello!")
        page.should have_content("You have lost")
        page.should have_selector("#score", text: /^-1$/)
        page.should have_selector("#action", text: "Reset")
        find('#action').click
        
        page.should have_content("Hello!")
        page.should have_selector("#action", text: "Play")
        page.should_not have_content("You have lost")

        find('#action').click
        page.should have_selector("#score", text: /^-2$/)
      end
    end

    describe "valid non-default wager" do
      it "Awards the wager amount if next generated value is a 1" do
        Random.any_instance.stub(:rand).and_return(1)
        fill_in "wager", with: 5
        find('#action').click
        page.should have_selector('#score', text: /^5$/)
      end


      it "Deducts the wager amount if next generated value is a 0" do
        Random.any_instance.stub(:rand).and_return(0)
        fill_in "wager", with: 5
        find('#action').click
        page.should have_selector('#score', text: /^-5$/)
      end
    end

    describe "invalid wager" do
      it "Sets the wager to 1 if wager is 0" do
        fill_in "wager", with: "0"
        find('#action').click
        page.should have_selector('#score', text: '1')
      end

      # A bug in Poltergeist prevents this test from passing      
      xit "Sets the wager to 1 if wager is negative" do
        fill_in "wager", with: "-5"
        find('#action').click
        page.should have_selector('#score', text: '1')
      end

      it "Sets the wager to 1 if wager is not a number" do
        fill_in "wager", with: "a salmon"
        find('#action').click
        page.should have_selector('#score', text: '1')
      end
    end
  end
end