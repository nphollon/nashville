require 'json'

module Nashville
  class Game
    USER_VICTORY = 1
    NUMBER_OF_END_STATES = 2

    attr_accessor :game_state
    attr_reader :rng, :score
    private :rng

    def initialize(rng)
      @rng = rng
      @game_state = GameNotStarted.new
      @score = Score.new
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
      { message: result_string, actionAvailable: score.actionAvailable, score: score.value }.to_json
    end

    private
    def play
      outcome = rng.rand(NUMBER_OF_END_STATES)
      self.game_state = outcome == USER_VICTORY ? GameWon.new : GameLost.new
    end

    def reset
      self.game_state = GameNotStarted.new
    end

    def update
      score.update result_string
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

  class Score
    VICTORY_STRING = "You have won"
    DEFEAT_STRING = "You have lost"
    PLAY_STRING = "Play"
    RESET_STRING = "Reset"

    attr_accessor :value, :actionAvailable
    private :value=, :actionAvailable=

    def initialize
      @value = 0
      @actionAvailable = PLAY_STRING
    end

    def update(result_string)
      points = case(result_string)
      when VICTORY_STRING
        self.actionAvailable = RESET_STRING
        1
      when DEFEAT_STRING
        self.actionAvailable = RESET_STRING
        -1
      else
        self.actionAvailable = PLAY_STRING
        0
      end
      change_by points
    end

    private
    def change_by(points)
      self.value = value + points
    end
  end
end