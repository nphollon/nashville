require 'json'
require_relative './game_state'

module Nashville
  class Game
    attr_accessor :game_state, :score
    attr_reader :rng
    private :score=

    def initialize(rng)
      @rng = rng
      @game_state = GameNotStarted.new
      @score = 0
    end

    def proceed_to_next_state
      self.game_state = game_state.determine_next_state rng
      change_score_by game_state.point_value
    end

    def result_string
      game_state.to_s
    end

    def to_json
      { message: result_string, actionAvailable: game_state.action_available, score: score }.to_json
    end

    private
    def change_score_by(points)
      self.score = score + points
    end
  end
end