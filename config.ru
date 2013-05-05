require 'sinatra'
require 'barista'
require 'sass/plugin/rack'
require './app/application'

use Sass::Plugin::Rack

configure :development do
  set :bind, "0.0.0.0"
end

configure :test do
  set :root, File.dirname(__FILE__)
end

run Application