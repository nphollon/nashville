require 'sinatra'
require_relative './winner'

set :bind, "0.0.0.0"
set :root, File.dirname(__FILE__)

get '/' do
  haml :index
end

get '/result' do
  Winner.win_msg
end