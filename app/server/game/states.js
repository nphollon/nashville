"use strict";

var events = require("./events")

var statePrototype = {}

var getStatus = function (winnerIndex, playerIndex) {
  if (winnerIndex === undefined) {
    return "Place your bet."
  }
  if (winnerIndex === playerIndex) {
    return "You won."
  }
  return "You lost."
}

var copy = function (original) {
  var state = Object.create(statePrototype)
  state.nextEventType = original.nextEventType
  state.nextPlayerIndex = original.nextPlayerIndex
  state.wager = original.wager
  state.score = original.score
  state.winnerIndex = original.winnerIndex
  return state
}

statePrototype.win = function () {
  var newState = copy(this)
  newState.score += newState.wager
  newState.winnerIndex = 0
  newState.nextEventType = events.playerType
  Object.freeze(newState)
  return newState
}

statePrototype.lose = function () {
  var newState = copy(this)
  newState.score -= newState.wager
  newState.winnerIndex = 1
  newState.nextEventType = events.playerType
  Object.freeze(newState)
  return newState
}

statePrototype.setWager = function (wager) {
  var newState = copy(this)
  newState.wager = wager
  newState.nextEventType = events.chanceType
  Object.freeze(newState)
  return newState
}

statePrototype.toResponse = function (playerIndex) {
  var response = {
    enableInput: (this.nextPlayerIndex === playerIndex),
    wager: this.wager,
    score: this.score,
    status: getStatus(this.winnerIndex, playerIndex)
  }
  Object.freeze(response)
  return response
}

exports.build = function (spec) {
  var defaults = {
    nextEventType: events.playerType,
    nextPlayerIndex: 0,
    wager: 1, 
    score: 0,
  }

  Object.keys(spec || {}).forEach(function (key) {
    defaults[key] = spec[key]
  })

  var state = copy(defaults)
  Object.freeze(state)
  return state
}
