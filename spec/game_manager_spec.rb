require 'spec_helper'
require 'digest/sha2'
require_relative '../app/game_manager'

describe "GameManager" do
  let(:wager) { 5 }
  let(:valid_session_id) { "Session ID" }
  let(:invalid_session_id) { "Invalid ID" }
  let(:game) { double(Nashville::Game) }
  
  let(:game_manager) {
    session_id_generator = double
    session_id_generator.stub(:get_id).and_return(valid_session_id)

    game_factory = double
    game_factory.stub(:build).and_return(game)
    Nashville::GameManager.new(game_factory, session_id_generator)
  }

  describe "new_game_session" do
    it "should return a game and session id" do
      session_and_game = game_manager.new_game_session

      session_and_game[0].should == valid_session_id
      session_and_game[1].should == game
    end
  end

  describe "respond_to" do
    it "should look up the appropriate game and mutate its state" do
      expected_response = "JSON response"
      game.stub(:to_json).and_return(expected_response)
      game.should_receive(:wager=).with(wager)
      game.should_receive(:proceed_to_next_state)

      game_manager.new_game_session

      response = game_manager.respond_to(build_params(valid_session_id))
      response.should == expected_response
    end

    it "should return empty json if there is no game for a session id" do
      response = game_manager.respond_to(build_params(invalid_session_id))
      response.should == "{}"
    end
  end

  def build_params(session_id)
    { session_id: session_id, wager: wager.to_s}
  end
end