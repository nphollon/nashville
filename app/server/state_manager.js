"use strict";

exports.createState = function (original) {
  if (original === undefined) {
    return {
      needChanceEvent: false,
      wager: 1,
      score: 0,
      status: ""
    }
  } else {
    return {
      needChanceEvent: original.needChanceEvent,
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
    state.needChanceEvent = false

    process.nextTick(function () {
      callback(null, state)
    })
  }

  var setWager = function (state, decision, callback) {
    state.wager = decision.wager
    state.needChanceEvent = true
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

    var mutators = {
      true: adjustScore,
      false: setWager
    }

    var neededProperty = {
      true: "userWins",
      false: "wager"
    }

    var key = nextState.needChanceEvent

    if (decision.hasOwnProperty(neededProperty[key])) {
      mutators[key].call(null, nextState, decision, callback)
    } else {
      raiseStateError(nextState, decision, callback)
    }
  }

  return stateManager
}