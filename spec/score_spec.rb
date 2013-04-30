require 'spec_helper'
require_relative '../app/game'

describe Nashville::Score do
  its(:value) { should == 0 }
  its(:actionAvailable) { should == "Play" }

  describe "update" do
    it "should increment value if input is 'You have won'" do
      subject.update("You have won")
      subject.value.should == 1
      subject.update("You have won")
      subject.value.should == 2
      subject.actionAvailable.should == "Reset"
    end

    it "should decrement value if input is 'You have lost'" do
      subject.update("You have lost")
      subject.value.should == -1
      subject.update("You have lost")
      subject.value.should == -2
      subject.actionAvailable.should == "Reset"
    end

    it "should not change value if input is something else" do
      subject.update("arbitrary string")
      subject.value.should == 0
      subject.actionAvailable.should == "Play"
    end
  end
end