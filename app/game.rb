require 'json'
require_relative './game_state'

module Nashville
  class Game
    INIT_WAGER = 1
    INIT_SCORE = 0

    attr_accessor :game_state, :score, :wager
    attr_reader :rng
    private :score=, :rng

    def initialize(rng)
      @rng = rng
      @game_state = GameNotStarted.new
      @score = INIT_SCORE
      @wager = INIT_WAGER
    end

    def proceed_to_next_state
      self.game_state = game_state.determine_next_state rng
      change_score_by (game_state.point_multiplier * wager)
    end

    def result_string
      game_state.to_s
    end

    def action_available
      game_state.action_available
    end

    def to_json
      { message: result_string, actionAvailable: action_available, score: score, wager: wager }.to_json
    end

    def wager=(new_wager)
      @wager = new_wager < 1 ? INIT_WAGER : new_wager
    end

    private
    def change_score_by(points)
      self.score = score + points
    end
  end
end