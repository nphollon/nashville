require 'sinatra'
require 'haml'
require_relative './game'

def load_barista
  require 'barista'
  register Barista::Integration::Sinatra
  Barista.configure do |config|
    config.root = "app/coffeescripts"
    config.output_root = "app/public/javascripts"
  end
end

configure :development do
  load_barista
  set :bind, "0.0.0.0"
end

configure :test do
  load_barista
  set :root, File.dirname(__FILE__)
end

game = Nashville::Game.new(Random.new)

get '/' do
  haml :index
end

get '/result' do
  game.play
  game.result_string
end