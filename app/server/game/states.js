"use strict";

var events = require("./events")

var statePrototype = {}

var copy = function (original) {
  var state = Object.create(statePrototype)
  state.nextEventType = original.nextEventType
  state.nextPlayerIndex = original.nextPlayerIndex
  state.wager = original.wager
  state.score = original.score
  state.status = original.status
  return state
}

statePrototype.win = function () {
  var newState = copy(this)
  newState.score += newState.wager
  newState.status = "You won."
  newState.nextEventType = events.playerType
  Object.freeze(newState)
  return newState
}

statePrototype.lose = function () {
  var newState = copy(this)
  newState.score -= newState.wager
  newState.status = "You lost."
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
    status: this.status
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
    status: "Place your bet."
  }

  Object.keys(spec || {}).forEach(function (key) {
    defaults[key] = spec[key]
  })

  var state = copy(defaults)
  Object.freeze(state)
  return state
}
