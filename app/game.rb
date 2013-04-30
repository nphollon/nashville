require 'json'

module Nashville
  class Game
    VICTORY_STRING = "You have won"
    DEFEAT_STRING = "You have lost"
    PLAY_STRING = "Play"
    RESET_STRING = "Reset"

    USER_VICTORY = 1
    NUMBER_OF_END_STATES = 2

    attr_accessor :game_state, :action_available, :value
    attr_reader :rng
    private :rng, :value=

    def initialize(rng)
      @rng = rng
      @game_state = GameNotStarted.new
      @action_available = PLAY_STRING
      @value = 0
    end

    def next_state
      case game_state
      when GameNotStarted.new
        play
      else
        reset
      end
      update
    end

    def result_string
      game_state.to_s
    end

    def to_json
      { message: result_string, actionAvailable: action_available, score: value }.to_json
    end

    private

    def update
      points = case(result_string)
      when VICTORY_STRING
        self.action_available = RESET_STRING
        1
      when DEFEAT_STRING
        self.action_available = RESET_STRING
        -1
      else
        self.action_available = PLAY_STRING
        0
      end
      change_by points
    end

    def play
      outcome = rng.rand(NUMBER_OF_END_STATES)
      self.game_state = outcome == USER_VICTORY ? GameWon.new : GameLost.new
    end

    def reset
      self.game_state = GameNotStarted.new
    end

    def change_by(points)
      self.value = value + points
    end
  end

  class GameState
    def to_s
      raise NotImplementedError
    end

    def ==(object)
      to_s == object.to_s
    end
  end

  class GameWon < GameState
    VICTORY_STRING = "You have won"
    def to_s
      VICTORY_STRING
    end
  end

  class GameLost < GameState
    DEFEAT_STRING = "You have lost"
    def to_s
      DEFEAT_STRING
    end
  end

  class GameNotStarted < GameState
    WELCOME_STRING = "Hello!"
    def to_s
      WELCOME_STRING
    end
  end
end