"use strict";

var events = require("./events")

exports.build = function () {
  var stateManager = {}

  var adjustScore = function (state, decision, callback) {
    callback(null, state.win(decision.userWins).nextPlayer())
  }

  var setWager = function (state, decision, callback) {
    callback(null, state.setWager(decision.wager).nextPlayer())
  }

  var raiseStateError = function (state, decision, callback) {
    var error = new Error("State manager received invalid decision.")
    error.decision = decision
    error.state = state
    callback(error)
  }

  var mutator = {}
  mutator[events.chanceType] = adjustScore
  mutator[events.playerType] = setWager

  stateManager.advance = function (state, decision, callback) {
    process.nextTick(function () {
      if (decision.type === state.nextEventType) {
        mutator[decision.type].call(null, state, decision, callback)
      } else {
        raiseStateError(state, decision, callback)
      }
    })
  }

  return stateManager
}