class Game
  attr_reader :rng
  private :rng

  def initialize(rng)
    @rng = rng
  end

  def result_msg
    choice = rng.rand(2)
    choice == 0 ? "You have lost" : "You have won"
  end
end