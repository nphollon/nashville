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

Object.defineProperty(statePrototype, "playerCount", {
  get: function () { return this.scores.length }
})

Object.defineProperty(statePrototype, "chancePlayerIndex", {
  get: function () { return this.scores.length }
})

exports.setWager = function (wager) {
  return function (state, callback) {

    var newState = copy(state)
    newState.wager = wager
    Object.freeze(newState)

    process.nextTick(function () {
      callback(null, newState)
    })
  }
}

exports.win = function (winnerIndex) {
  return function (state, callback) {
    var newState = copy(state)
    var loserCount = state.playerCount - 1

    state.scores.forEach(function (score, index) {
      if (index === winnerIndex) {
        newState.scores[index] = score + loserCount * newState.wager
      } else {
        newState.scores[index] = score - newState.wager
      }
    })

    newState.winnerIndex = winnerIndex
    Object.freeze(newState)

    process.nextTick(function () {
      callback(null, newState)
    })
  }
}

exports.nextPlayer = function(state, callback) {

  var newState = copy(state)
  var mutator = playerMutator[state.nextEventType]

  newState.lastPlayerIndex = state.nextPlayerIndex
  newState.nextPlayerIndex = mutator.incrementPlayerIndex(state)

  newState.nextEventType = mutator.nextEventType

  Object.freeze(newState)

  process.nextTick(function () {
    callback(null, newState)
  })
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
