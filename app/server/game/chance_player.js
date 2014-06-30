"use strict";

var events = require("./events")

exports.build = function (random, inputCallbacks) {
  var chancePlayer = {}

  var playerCount = function (state) {
    return state.scores.length - 1
  }

  chancePlayer.start = function () {
    process.nextTick(function () {
      inputCallbacks.requestUpdate(chancePlayer.getNextEvent)
    })
  }

  chancePlayer.getNextEvent = function (error, state) {
    if (error === null) {
      var winningPlayerIndex = random.integer(0, playerCount(state))

      process.nextTick(function () {
        inputCallbacks.submitDecision(events.chanceEvent(winningPlayerIndex), chancePlayer.getNextEvent)
      })
    }
  }

  return chancePlayer
}