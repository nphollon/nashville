require 'sinatra'
require 'sass/plugin/rack'
require './application'

use Sass::Plugin::Rack

register Barista::Integration::Sinatra
Barista.configure do |config|
  config.root = "public/javascripts/coffee"
  config.output_root = "public/javascripts"
end

configure :development do
  set :bind, "0.0.0.0"
end

configure :test do
  set :root, File.dirname(__FILE__)
end

run Application