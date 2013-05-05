require 'digest/sha2'
require_relative './game'

module Nashville
  class GameManager
    def initialize
      @games_hash = {}
    end

    def new_game_session
      game = create_game
      session_id = create_session_id
      games_hash[session_id] = game
      [session_id, game]
    end

    def respond_to(params)
      game = self[params[:session_id]]
      game.wager = params[:wager].to_i
      game.proceed_to_next_state
      game.to_json
    end

    def [](session_id)
      games_hash[session_id]
    end

    private
    attr_accessor :games_hash
    
    def create_game
      Game.new(Random.new)
    end

    def create_session_id
      (Digest::SHA2.new << Time.now.to_s).to_s
    end
  end
end