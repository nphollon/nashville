require 'spec_helper'
require_relative '../app/game'

describe "Game" do
  let(:rng) { Random.new }
  let(:game) { Nashville::Game.new(rng) }

  describe "play" do
    it "should call rand with a choice of 2" do
      rng.should_receive(:rand).with(2)
      game.play
    end

    it "awards user victory if next generated value is 1" do
      rng.stub(:rand).and_return(1)
      game.play
      game.user_won?.should be_true
    end

    it "awards user loss if next generated value is 0" do
      rng.stub(:rand).and_return(0)
      game.play
      game.user_won?.should be_false
    end    
  end

  describe "result_string" do
    it "should raise error if game has not been played" do
      expect { game.result_string }.to raise_error(Nashville::NoGamePlayedError)
    end

    it "should return 'You have won' if user lost" do
      game.stub(:user_won?).and_return(true)
      game.result_string.should == "You have won"
    end

    it "should return 'You have lost' if user lost" do
      game.stub(:user_won?).and_return(false)
      game.result_string.should == "You have lost"
    end
  end
end