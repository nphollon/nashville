module Nashville
  class Game
    USER_VICTORY = 1
    NUMBER_OF_PLAYERS = 2
    VICTORY_STRING = "You have won"
    DEFEAT_STRING = "You have lost"

    attr_reader :rng, :outcome
    private :rng, :outcome

    def initialize(rng)
      @rng = rng
    end

    def play
      @outcome = rng.rand(NUMBER_OF_PLAYERS)
    end

    def user_won?
      raise NoGamePlayedError unless outcome
      outcome == USER_VICTORY
    end

    def result_string
      user_won? ? VICTORY_STRING : DEFEAT_STRING
    end
  end

  class Error < StandardError; end
  class NoGamePlayedError < Error; end
end