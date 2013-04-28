require 'sinatra'
require 'barista'
require_relative './game'

register Barista::Integration::Sinatra

Barista.configure do |config|
  config.root = "app/coffeescripts"
  config.output_root = "app/public/javascripts"
end

set :bind, "0.0.0.0"
set :root, File.dirname(__FILE__)

game = Game.new(Random.new)

get '/' do
  haml :index
end

get '/result' do
  game.result_msg
end