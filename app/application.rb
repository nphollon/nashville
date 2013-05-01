require 'sinatra/base'
require 'barista'
require 'haml'
require 'json'

require_relative './game'

class Application < Sinatra::Base
  register Barista::Integration::Sinatra
  Barista.configure do |config|
    config.root = "/home/vagrant/workspace/app/public/javascripts/coffee"
    config.output_root = "/home/vagrant/workspace/app/public/javascripts"
  end

  game = nil

  get '/' do
    haml :index
  end

  get '/init' do
    content_type :json
    game = Nashville::Game.new(Random.new)
    game.to_json
  end

  get '/play' do
    content_type :json
    game.proceed_to_next_state
    game.to_json
  end
end