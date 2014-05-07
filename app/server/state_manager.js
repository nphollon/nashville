"use strict";

exports.build = function () {
  var stateManager = {}

  stateManager.initialize = function (callback) {
    var initialState = {
      needChanceEvent: false,
      wager: 1,
      score: 0,
      status: ""
    }

    process.nextTick(function () {
      callback(null, initialState)
    })
  }

  stateManager.advance = function (previousState, decision, callback) {
    var nextState = {
      needChanceEvent: !previousState.needChanceEvent,
      wager: previousState.wager,
      score: previousState.score,
      status: ""
    }
    if (decision.userWins === undefined) {
      nextState.wager = decision.wager
    } else {
      nextState.score += nextState.wager * (decision.userWins ? 1 : -1)
    }
    process.nextTick(function () {
      callback(null, nextState)
    })
  }

  return stateManager
}