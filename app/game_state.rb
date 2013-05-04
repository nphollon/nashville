module Nashville
  class GameState
    def action_available; raise NotImplementedError; end
    def to_s; raise NotImplementedError; end
    def point_multiplier; raise NotImplementedError; end
    def determine_next_state(rng); raise NotImplementedError; end

    def ==(object)
      to_s == object.to_s
    end
  end

  class GameOver < GameState
    def action_available
      "Reset"
    end

    def determine_next_state(rng)
      GameNotStarted.new
    end
  end

  class GameWon < GameOver 
    def to_s
      "You have won"
    end

    def point_multiplier
      1
    end
  end

  class GameLost < GameOver
    def to_s
      "You have lost"
    end

    def point_multiplier
      -1
    end
  end

  class GameNotStarted < GameState
    def action_available
      "Play"
    end

    def to_s
      "Hello!"
    end

    def point_multiplier
      0
    end

    def determine_next_state(rng)
      outcome = rng.rand(2)
      outcome == 1 ? GameWon.new : GameLost.new
    end
  end
end