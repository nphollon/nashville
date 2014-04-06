require 'spec_helper'
require 'digest/sha2'
require_relative '../app/game_manager'

describe "GameManager" do
  describe "new_game_session" do
    it "should return a game and session id" do
      session_id_generator = double()
      session_id_generator.stub(:get_id).and_return("Session ID")

      game_stub = Nashville::Game.new(nil)
      game_factory = double()
      game_factory.stub(:build).and_return(game_stub)

      game_manager = Nashville::GameManager.new(game_factory, session_id_generator)
      
      session_and_game = game_manager.new_game_session
      
      session_and_game[0].should == "Session ID"
      session_and_game[1].should == game_stub
    end
  end
end