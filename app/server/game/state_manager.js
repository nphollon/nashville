"use strict";

var events = require("./events")
var states = require("./states")

exports.build = function (dispatcher) {
  var stateManager = {}

  var adjustScore = function (state, decision) {
    return state.win(decision.userWins).nextPlayer()
  }

  var setWager = function (state, decision) {
    return state.setWager(decision.wager).nextPlayer()
  }

  var stateError = function (state, decision) {
    var error = new Error("State manager received invalid decision.")
    error.decision = decision
    error.state = state
    return error
  }

  var mutateState = {}
  mutateState[events.chanceType] = adjustScore
  mutateState[events.playerType] = setWager

  stateManager.start = function (playerCount) {
    process.nextTick(function () {
      stateManager.getNextEvent(null, states.build(playerCount))
    })
  }

  stateManager.getNextEvent = function (error, state) {
    process.nextTick(function () {
      dispatcher.sendDispatch(state, function (error, decision) {
        stateManager.advance(state, decision, stateManager.getNextEvent)
      })
    })
  }

  stateManager.advance = function (state, decision, callback) {
    process.nextTick(function () {
      if (decision.type === state.nextEventType) {
        callback(null, mutateState[decision.type](state, decision))
      } else {
        callback(stateError(state, decision))
      }
    })
  }

  return stateManager
}