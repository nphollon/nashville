require 'sinatra/base'
require 'barista'
require 'haml'
require 'json'

require_relative './game_manager'

class Application < Sinatra::Base
  register Barista::Integration::Sinatra
  Barista.configure do |config|
    config.root = "/home/vagrant/workspace/app/public/javascripts/coffee"
    config.output_root = "/home/vagrant/workspace/app/public/javascripts"
  end

  games = Nashville::GameManager.new

  get '/' do 
    session_id, game = games.new_game_session
    haml :index, locals: { session_id: session_id, game: game }
  end

  post '/play' do
    content_type :json
    games.respond_to params
  end
end