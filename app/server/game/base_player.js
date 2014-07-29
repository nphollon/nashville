"use strict";

exports.build = function (inputCallbacks, makeDecision) {
  var player = {}

  var start = function () {
    process.nextTick(function () {
      inputCallbacks.requestUpdate(getNextEvent)
    })
  }

  var getNextEvent = function (error, state) {
    if (error) { return }

    process.nextTick(function () {
      makeDecision(state, submitDecision)
    })
  }

  var submitDecision = function (decision) {
    process.nextTick(function () {
      inputCallbacks.submitDecision(decision, getNextEvent)
    })
  }

  player.start = makeDecision ? start : function () {}

  return player
}
