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

  games = []

  get '/' do
    games << Nashville::Game.new(Random.new)
    haml :index, locals: { id: games.size-1, game: games.last }
  end

  get '/play' do
    session_id = params[:session_id].to_i
    content_type :json
    games[session_id].proceed_to_next_state
    games[session_id].to_json
  end
end