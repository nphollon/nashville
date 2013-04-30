require 'spec_helper'
require_relative '../app/game'

describe "Game" do
  let(:rng) { Random.new }
  let(:game) { Nashville::Game.new(rng) }
  subject { game }

  describe "next_state" do
    it "should set result_string to 'You have won' if game not started and next generated value is 1" do
      rng.stub(:rand).and_return(1)
      game.game_state = Nashville::GameNotStarted.new
      game.next_state
      game.result_string.should == 'You have won'
    end

    it "should set result_string to 'You have lost' if game not started and next generated value is 0" do
      rng.stub(:rand).and_return(0)
      game.game_state = Nashville::GameNotStarted.new
      game.next_state
      game.result_string.should == 'You have lost'
    end

    it "should set result_string to 'Hello!' if game won" do
      game.game_state = Nashville::GameWon.new
      game.next_state
      game.result_string.should == 'Hello!'
    end

    it "should set result_string to 'Hello!' if game lost" do
      game.game_state = Nashville::GameLost.new
      game.next_state
      game.result_string.should == 'Hello!'
    end
  end
end