"use strict";

var events = require("./game_events")

exports.createState = function (original) {
  if (original === undefined) {
    return {
      nextEventType: events.playerType,
      wager: 1,
      score: 0,
      status: ""
    }
  } else {
    return {
      nextEventType: original.nextEventType,
      wager: original.wager,
      score: original.score,
      status: original.status
    }  
  }
}

exports.build = function () {
  var stateManager = {}

  var adjustScore = function (state, decision, callback) {
    state.score += state.wager * (decision.userWins ? 1 : -1)
    state.nextEventType = events.playerType

    process.nextTick(function () {
      callback(null, state)
    })
  }

  var setWager = function (state, decision, callback) {
    state.wager = decision.wager
    state.nextEventType = events.chanceType

    process.nextTick(function () {
      callback(null, state)
    })
  }

  var raiseStateError = function (state, decision, callback) {
    process.nextTick(function () {
      var error = new Error("State manager received invalid decision.")
      error.decision = decision
      error.state = state
      callback(error)
    })
  }

  stateManager.initialize = function (callback) {
    process.nextTick(function () {
      callback(null, exports.createState())
    })
  }

  stateManager.advance = function (previousState, decision, callback) {
    var nextState = exports.createState(previousState)

    var mutator = {}
    mutator[events.chanceType] = adjustScore
    mutator[events.playerType] = setWager

    if (decision.type === nextState.nextEventType) {
      mutator[decision.type].call(null, nextState, decision, callback)
    } else {
      raiseStateError(nextState, decision, callback)
    }
  }

  return stateManager
}