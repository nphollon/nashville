"use strict";

var events = require("./events")
var player = require("./base_player")

exports.build = function (inputCallbacks) {
  var decision = events.playerEvent({ wager: 1 })

  var makeDecision = function (state, callback) {
    process.nextTick(function () {
      callback(decision)
    })
  }

  return player.build(inputCallbacks, makeDecision)
}