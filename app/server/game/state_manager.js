"use strict";

var events = require("./events")

exports.mutateState = {}

exports.mutateState[events.chanceType] = function (state, decision, callback) {
  process.nextTick(function () {
    callback(null, state.win(decision.userWins).nextPlayer())
  })
}

exports.mutateState[events.playerType] = function (state, decision, callback) {
  process.nextTick(function () {
    callback(null, state.setWager(decision.wager).nextPlayer())
  })
}


exports.build = function (dispatcher, mutateState) {
  var stateManager = {}

  var stateError = function (state, decision) {
    var error = new Error("State manager received invalid decision.")
    error.decision = decision
    error.state = state
    return error
  }

  var processDecision = function (state) {
    return function (error, decision) {
      process.nextTick(function () {
        if (decision.type === state.nextEventType) {
          mutateState[decision.type](state, decision, getNextEvent)
        } else {
          getNextEvent(stateError(state, decision))
        }
      })
    }
  }

  var getNextEvent = function (error, state) {
    if (error === null) {
      dispatcher.sendDispatch(state, processDecision(state))
    } else {
      dispatcher.sendError(error)
    }
  }

  stateManager.start = function (startState) {
    getNextEvent(null, startState)
  }

  return stateManager
}