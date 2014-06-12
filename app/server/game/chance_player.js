"use strict";

var events = require("./events")

exports.build = function (random) {
  var chancePlayer = {}

  var playerCount = function (state) {
    return state.scores.length - 1
  }

  chancePlayer.getNextEvent = function (state, callback) {
    var winningPlayerIndex = random.integer(0, playerCount(state))
    process.nextTick(function () {
      callback(null, events.chanceEvent(winningPlayerIndex))
    })
  }

  return chancePlayer
}