# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu_13_10"
  config.vm.box_url = "http://puppet-vagrant-boxes.puppetlabs.com/ubuntu-1310-i386-virtualbox-nocm.box"
  config.vm.network :forwarded_port, guest: 4567, host: 4567
  config.vm.synced_folder ".", "/home/vagrant/workspace"

  config.vm.provision :shell, inline: <<-SCRIPT
    apt-get update
    apt-get -y install software-properties-common python-software-properties
    apt-add-repository ppa:chris-lea/node.js
    apt-get update
    apt-get -y install nodejs git

    npm install grunt-cli zombie -g
  SCRIPT
end
