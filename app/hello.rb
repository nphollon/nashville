require 'sinatra'

set :bind, "0.0.0.0"
set :root, File.dirname(__FILE__)

get '/' do
  haml :index
end