"use strict";

var events = require("./events")

exports.decider = function (random) {
  return function (state, callback) {
    var playerCount = state.players.length - 1
    var winningPlayerIndex = random.integer(0, playerCount)

    process.nextTick(function () {
      callback(events.chanceEvent(winningPlayerIndex))
    })
  }
}
