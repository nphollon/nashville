require 'json'
require_relative './game_state'

module Nashville
  class Game
    INIT_WAGER = 1
    INIT_SCORE = 0

    attr_accessor :game_state, :wager, :p1_score, :p2_score
    attr_reader :rng
    private :rng, :p1_score, :p2_score, :p1_score=, :p2_score=

    def initialize(rng)
      @rng = rng
      @game_state = GameNotStarted.new
      @p1_score = INIT_SCORE
      @p2_score = INIT_SCORE
      @wager = INIT_WAGER
    end

    def proceed_to_next_state
      self.game_state = game_state.determine_next_state rng
      change_scores_by (game_state.point_multiplier * wager)
    end

    def result_string
      game_state.to_s
    end

    def action_available
      game_state.action_available
    end

    def to_json
      { message: result_string, actionAvailable: action_available, scores: scores, wager: wager }.to_json
    end

    def wager=(new_wager)
      @wager = if new_wager > 0
        new_wager
      else
        INIT_WAGER
      end
    end

    def scores
      [p1_score, p2_score]
    end

    private
    def change_scores_by(points)
      self.p1_score = p1_score + points
      self.p2_score = p2_score - points
    end
  end
end