require 'spec_helper'
require 'digest/sha2'
require_relative '../app/game_manager'

describe "GameManager" do
  # to do: use let syntax
  before do
    @session_id = "Session ID"

    session_id_generator = double()
    session_id_generator.stub(:get_id).and_return(@session_id)

    @game = double(Nashville::Game)
    game_factory = double()
    game_factory.stub(:build).and_return(@game)

    @game_manager = Nashville::GameManager.new(game_factory, session_id_generator)
  end

  describe "new_game_session" do
    it "should return a game and session id" do
      session_and_game = @game_manager.new_game_session
   
      session_and_game[0].should == @session_id
      session_and_game[1].should == @game
    end
  end

  describe "respond_to" do
    it "should look up the appropriate game and mutate its state" do
      expected_response = "JSON response"
      @game.stub(:to_json).and_return(expected_response)
      @game.should_receive(:wager=).with(5)
      @game.should_receive(:proceed_to_next_state)

      @game_manager.new_game_session

      params = { session_id: @session_id, wager: "5" }

      response = @game_manager.respond_to(params)
      response.should == "JSON response"
    end
  end
end