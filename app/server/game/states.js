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
  state.scores = original.scores
  state.winnerIndex = original.winnerIndex
  return state
}

// TODO: win() and lose() only work for 2-player game
statePrototype.win = function () {
  var newState = copy(this)
  newState.scores[0] += newState.wager
  newState.scores[1] -= newState.wager
  newState.winnerIndex = 0
  newState.nextEventType = events.playerType
  Object.freeze(newState)
  return newState
}

statePrototype.lose = function () {
  var newState = copy(this)
  newState.scores[0] -= newState.wager
  newState.scores[1] += newState.wager
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
    playerIndex: playerIndex,
    enableInput: (this.nextPlayerIndex === playerIndex),
    wager: this.wager,
    scores: this.scores,
    status: getStatus(this.winnerIndex, playerIndex)
  }
  Object.freeze(response)
  return response
}

exports.build = function (playerCount, spec) {
  var defaults = {
    nextEventType: events.playerType,
    nextPlayerIndex: 0,
    wager: 1,
    scores: []
  }

  Object.keys(spec || {}).forEach(function (key) {
    defaults[key] = spec[key]
  })

  while (defaults.scores.length < playerCount) {
    defaults.scores.push(0)
  }

  var state = copy(defaults)
  Object.freeze(state)
  return state
}
