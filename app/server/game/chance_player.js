"use strict";

var events = require("./events")
var player = require("./base_player")

exports.build = function (random, inputCallbacks) {
  var makeDecision = function (state, callback) {
    var playerCount = state.scores.length - 1
    var winningPlayerIndex = random.integer(0, playerCount)

    process.nextTick(function () {
      callback(events.chanceEvent(winningPlayerIndex))
    })
  }

  return player.build(inputCallbacks, makeDecision)
}