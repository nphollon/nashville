require 'sinatra'
require_relative './game'

set :bind, "0.0.0.0"
set :root, File.dirname(__FILE__)

game = Game.new(Random.new)

get '/' do
  haml :index
end

get '/result' do
  game.result_msg
end