# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu_13_10"
  config.vm.box_url = "http://puppet-vagrant-boxes.puppetlabs.com/ubuntu-1310-i386-virtualbox-nocm.box"
  config.vm.network :forwarded_port, guest: 9292, host: 4567
  config.vm.synced_folder ".", "/home/vagrant/workspace"

  config.vm.provision :shell, inline: <<-SCRIPT
    apt-get update
    apt-get -y install software-properties-common python-software-properties
    apt-add-repository ppa:brightbox/ruby-ng
    apt-add-repository ppa:chris-lea/node.js
    apt-get update
    apt-get -y install ruby2.0-dev nodejs libxslt-dev libxml2-dev libfontconfig1 phantomjs
    
    rm -rf /opt/vagrant_ruby/
    rm /etc/profile.d/vagrant_ruby.sh
    
    npm install jasmine-node -g
    gem install bundler
    bundle install --gemfile=/home/vagrant/workspace/Gemfile
  SCRIPT
end
