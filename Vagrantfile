# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "precise32"
  config.vm.box_url = "http://files.vagrantup.com/precise32.box"
  config.vm.network :forwarded_port, guest: 4567, host: 4567
  config.vm.synced_folder ".", "/home/vagrant/workspace"

  config.vm.provision :shell, inline: <<-SCRIPT
    apt-get update
    apt-get -y install ruby1.9.3 make g++ libxslt-dev libxml2-dev
    gem install bundler
    bundle install --gemfile=/home/vagrant/workspace/Gemfile
  SCRIPT
end
