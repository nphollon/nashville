"use strict";

exports.build = function (inputCallbacks) {
  var opponent = {}
  var decision = { wager: 1}

  opponent.start = function () {
    process.nextTick(function () {
      inputCallbacks.requestUpdate(opponent.getNextEvent)
    })
  }

  opponent.getNextEvent = function () {
    process.nextTick(function () {
      inputCallbacks.submitDecision(decision, opponent.getNextEvent)
    })
  }

  return opponent
}