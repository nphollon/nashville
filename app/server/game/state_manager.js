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

  var processDecision = function (state) {
    return function (error, decision) {
      if (decision.type === state.nextEventType) {
        stateManager.getNextEvent(null, mutateState[decision.type](state, decision))
      } else {
        stateManager.getNextEvent(stateError(state, decision))
      }
    }
  }

  stateManager.start = function (playerCount) {
    stateManager.getNextEvent(null, states.build(playerCount))
  }

  stateManager.getNextEvent = function (error, state) {
    if (error === null) {
      dispatcher.sendDispatch(state, processDecision(state))
    } else {
      dispatcher.sendError(error)
    }
  }

  return stateManager
}