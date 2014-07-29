"use strict";

exports.build = function (inputCallbacks, makeDecision) {
  var player = {}

  var submitDecision = function (decision) {
    process.nextTick(function () {
      inputCallbacks.submitDecision(decision, player.getNextEvent)
    })
  }
  
  player.start = function () {
    process.nextTick(function () {
      inputCallbacks.requestUpdate(player.getNextEvent)
    })
  }

  player.getNextEvent = function (error, state) {
    if (error) { return }

    process.nextTick(function () {
      makeDecision(state, submitDecision)
    })
  }

  return player
}
