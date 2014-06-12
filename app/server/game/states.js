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

statePrototype.win = function (winnerIndex) {
  var newState = copy(this)
  var loserCount = this.playerCount - 1

  this.scores.forEach(function (score, index) {
    if (index === winnerIndex) {
      newState.scores[index] = score + loserCount * newState.wager
    } else {
      newState.scores[index] = score - newState.wager
    }
  })

  newState.winnerIndex = winnerIndex
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

statePrototype.nextPlayer = function () {
  var newState = copy(this)
  newState.nextPlayerIndex = (this.nextPlayerIndex + 1) % this.playerCount
  newState.nextEventType = events.playerType
  Object.freeze(newState)
  return newState
}

Object.defineProperty(statePrototype, "playerCount", {
  get: function () { return this.scores.length }
})

exports.build = function (playerCount, spec) {
  var defaults = {
    nextEventType: events.playerType,
    nextPlayerIndex: 0,
    numberOfPlayers: playerCount,
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
