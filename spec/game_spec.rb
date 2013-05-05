require 'spec_helper'
require_relative '../app/game'

describe "Game" do
  let(:rng) { Random.new }
  let(:game) { Nashville::Game.new(rng) }
  subject { game }

  describe "proceed_to_next_state" do
    describe "game not started" do
      before { game.game_state = Nashville::GameNotStarted.new }

      describe "next generated value is 1" do
        before { rng.stub(:rand).and_return(1) }
        
        it "should set result_string to 'You have won'" do
          game.proceed_to_next_state
          game.result_string.should == 'You have won'
        end

        it "should increase score by 1 if wager is 1" do
          expect { game.proceed_to_next_state }.to change{ game.score }.by 1
        end

        it "should increase score by 10 if wager is 10" do
          game.wager = 10
          expect { game.proceed_to_next_state }.to change{ game.score }.by 10
        end
      end

      describe "next generated value is 0" do
        before { rng.stub(:rand).and_return(0) }

        it "should set result_string to 'You have lost'" do
          game.proceed_to_next_state
          game.result_string.should == 'You have lost'
        end

        it "should decrease score by 1 if wager is 1" do
          expect { game.proceed_to_next_state }.to change{ game.score }.by -1
        end

        it "should decrease score by 10 if wager is 10" do
          game.wager = 10
          expect { game.proceed_to_next_state }.to change{ game.score }.by -10
        end
      end
    end

    it "should set result_string to 'Hello!' if game won" do
      game.game_state = Nashville::GameWon.new
      game.proceed_to_next_state
      game.result_string.should == 'Hello!'
    end

    it "should set result_string to 'Hello!' if game lost" do
      game.game_state = Nashville::GameLost.new
      game.proceed_to_next_state
      game.result_string.should == 'Hello!'
    end
  end

  describe "to_json" do
    its(:to_json) { should == '{"message":"Hello!","actionAvailable":"Play","score":0,"wager":1}' }
  end

  describe "wager=" do
    it "sets wager to 1 if passed a 0" do
      game.wager = 0
      game.wager.should == 1
    end

    it "sets wager to 1 if passed a negative number" do
      game.wager = -10
      game.wager.should == 1
    end
  end
end