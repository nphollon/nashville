"use strict";

var events = require("./game_events")

exports.build = function (random) {
  var chancePlayer = {}

  chancePlayer.getNextEvent = function (state, callback) {
    var userWins = random.bool()

    process.nextTick(function () {
      callback(null, events.chanceEvent(userWins))
    })
  }

  return chancePlayer
}