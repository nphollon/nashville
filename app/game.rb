class Game
  VICTORY_MSG = "You have won"
  DEFEAT_MSG = "You have lost"

  attr_reader :rng
  private :rng

  def initialize(rng)
    @rng = rng
  end

  def result_msg
    rng.rand(2) == 0 ? DEFEAT_MSG : VICTORY_MSG
  end
end