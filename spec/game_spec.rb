require 'spec_helper'
require_relative '../app/game'

describe "Game" do
  let(:rng) { Random.new }
  let(:game) { Game.new(rng) }

  describe "result_msg" do
    it "should call rand with a choice of 2" do
      rng.should_receive(:rand).with(2)
      game.result_msg
    end

    it "should return 'You have won' if next generated value is 1" do
      rng.stub(:rand).and_return(1)
      game.result_msg.should == "You have won"
    end

    it "should return 'You have lost' if next generated value is 0" do
      rng.stub(:rand).and_return(0)
      game.result_msg.should == "You have lost"
    end
  end
end