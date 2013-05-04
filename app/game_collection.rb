require 'digest/sha2'
require_relative './game'

module Nashville
  class GameCollection
    def initialize
      @games_hash = {}
    end

    def new_game_session
      game = Game.new(Random.new)
      session_id = generate_session_id
      games_hash[session_id] = game
      [session_id, game]
    end

    def [](session_id)
      games_hash[session_id]
    end

    private
    attr_accessor :games_hash
    
    def generate_session_id
      (Digest::SHA2.new << Time.now.to_s).to_s
    end
  end
end