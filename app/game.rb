module Nashville
  class Game
    USER_VICTORY = 1
    NUMBER_OF_PLAYERS = 2
    WELCOME_STRING = "Hello!"
    VICTORY_STRING = "You have won"
    DEFEAT_STRING = "You have lost"

    attr_accessor :state_string, :outcome
    attr_reader :rng
    private :rng, :outcome, :outcome=

    def initialize(rng)
      @rng = rng
    end

    def play
      self.outcome = rng.rand(NUMBER_OF_PLAYERS)
    end

    def next_state
      self.state_string = case @state_string
      when WELCOME_STRING
        play
        result_string
      else
        WELCOME_STRING
      end
    end

    def result_string
      user_won? ? VICTORY_STRING : DEFEAT_STRING
    end

    def user_won?
      raise NoGamePlayedError unless outcome
      outcome == USER_VICTORY
    end
  end

  class Error < StandardError; end
  class NoGamePlayedError < Error; end
end