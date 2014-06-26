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

var shouldEnableInput = function (state, playerIndex) {
  return state.nextPlayerIndex === playerIndex && state.nextEventType !== events.chanceType
}

var playerMutator = {}

playerMutator[events.playerType] = {
  incrementPlayerIndex: function (state) {
    return state.chancePlayerIndex
  },
  nextEventType: events.chanceType
}

playerMutator[events.chanceType] = {
  incrementPlayerIndex: function (state) {
    return (state.lastPlayerIndex + 1) % state.playerCount
  },
  nextEventType: events.playerType
}

var copy = function (original) {
  var state = Object.create(statePrototype)
  state.nextEventType = original.nextEventType
  state.lastPlayerIndex = original.lastPlayerIndex
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
  Object.freeze(newState)
  return newState
}

statePrototype.setWager = function (wager) {
  var newState = copy(this)
  newState.wager = wager
  Object.freeze(newState)
  return newState
}

statePrototype.toResponse = function (playerIndex) {
  var response = {
    playerIndex: playerIndex,
    enableInput: shouldEnableInput(this, playerIndex),
    wager: this.wager,
    scores: this.scores,
    status: getStatus(this.winnerIndex, playerIndex)
  }
  Object.freeze(response)
  return response
}

statePrototype.nextPlayer = function () {
  var newState = copy(this)
  var mutator = playerMutator[this.nextEventType]

  newState.lastPlayerIndex = this.nextPlayerIndex
  newState.nextPlayerIndex = mutator.incrementPlayerIndex(this)

  newState.nextEventType = mutator.nextEventType

  Object.freeze(newState)
  return newState
}

Object.defineProperty(statePrototype, "playerCount", {
  get: function () { return this.scores.length }
})

Object.defineProperty(statePrototype, "chancePlayerIndex", {
  get: function () { return this.scores.length }
})



exports.setWager = function (wager) {
  return function (state, callback) {
    process.nextTick(function () {
      callback(null, state.setWager(wager))
    })
  }
}

exports.win = function (winnerIndex) {
  return function (state, callback) {
    process.nextTick(function () {
      callback(null, state.win(winnerIndex))
    })
  }
}

exports.build = function (playerCount, spec) {
  var defaults = {
    nextEventType: events.playerType,
    lastPlayerIndex: playerCount,
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
