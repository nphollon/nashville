require 'digest/sha2'
require_relative './game'

module Nashville
  class GameManager
    def initialize(game_factory = nil, session_id_generator = nil)
      @games_hash = {}
      @game_factory = game_factory || GameFactory.new
      @session_id_generator = session_id_generator || SessionIdGenerator.new
    end

    def new_game_session
      game = game_factory.build
      session_id = session_id_generator.get_id
      games_hash[session_id] = game
      [session_id, game]
    end

    def respond_to(params)
      game = games_hash[ params[:session_id] ]
      return empty_response unless game

      game.wager = params[:wager].to_i
      game.proceed_to_next_state
      game.to_json
    end

    private
    attr_reader :games_hash, :session_id_generator, :game_factory

    def empty_response
      "{}"
    end
  end

  class SessionIdGenerator
    def get_id
      (Digest::SHA2.new << Time.now.to_s).to_s
    end
  end

  class GameFactory
    def build
      return Game.new(Random.new)
    end
  end
end