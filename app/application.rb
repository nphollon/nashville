require 'sinatra/base'
require 'barista'
require 'haml'

require_relative './game'

class Application < Sinatra::Base
  game = Nashville::Game.new(Random.new)

  get '/' do
    haml :index
  end

  get '/result' do
    game.play
    game.result_string
  end
end