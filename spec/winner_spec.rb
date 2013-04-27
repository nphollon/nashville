require 'spec_helper'
require_relative '../app/winner'

describe "Winner" do
  describe "win_msg" do
    it "should return 'You have won'" do
      Winner.win_msg.should == "You have won"
    end
  end
end