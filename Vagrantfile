# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "precise32"
  config.vm.box_url = "http://files.vagrantup.com/precise32.box"
  config.vm.network :forwarded_port, guest: 9292, host: 4567
  config.vm.synced_folder ".", "/home/vagrant/workspace"

  config.vm.provision :shell, inline: <<-SCRIPT
    apt-get update
    apt-get -y install make g++ libxslt-dev libxml2-dev nodejs curl

    curl -L https://get.rvm.io | bash -s stable --autolibs=3 --ruby
    echo "source /usr/local/lib/rvm" >> /etc/profile
    
    echo PATH=$PATH:/vagrant/bin >> /home/vagrant/.bashrc
    
    usermod --append --groups rvm vagrant
    
    rm -rf /opt/vagrant_ruby/
    rm /etc/profile.d/vagrant_ruby.sh
    
    gem install bundler
    bundle install --gemfile=/home/vagrant/workspace/Gemfile
  SCRIPT
end
