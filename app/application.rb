require 'sinatra/base'
require 'barista'
require 'haml'
require 'json'
require 'digest/sha2'

require_relative './game'

class Application < Sinatra::Base
  register Barista::Integration::Sinatra
  Barista.configure do |config|
    config.root = "/home/vagrant/workspace/app/public/javascripts/coffee"
    config.output_root = "/home/vagrant/workspace/app/public/javascripts"
  end

  games = {}

  get '/' do
    key = (Digest::SHA2.new << Time.now.to_s).to_s
    games[key] = Nashville::Game.new(Random.new)
    haml :index, locals: { id: key, game: games[key] }
  end

  post '/play' do
    game = games[params[:session_id]]
    content_type :json
    game.proceed_to_next_state
    game.to_json
  end
end