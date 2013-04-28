require 'sinatra/base'
require 'barista'
require 'haml'

require_relative './game'

class Application < Sinatra::Base
  register Barista::Integration::Sinatra
  Barista.configure do |config|
    config.root = "/home/vagrant/workspace/app/public/javascripts/coffee"
    config.output_root = "/home/vagrant/workspace/app/public/javascripts"
  end

  game = Nashville::Game.new(Random.new)

  get '/' do
    haml :index
  end

  get '/result' do
    game.play
    game.result_string
  end
end