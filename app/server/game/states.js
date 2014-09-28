"use strict";

var async = require("async")
var events = require("./events")

var statePrototype = {}

var playerName = function (playerIndex) {
  return "Player " + (playerIndex + 1)
}

var wagerMessage = function (playerIndex, wager) {
  return playerName(playerIndex) + " has bet $" + wager
}

var victoryMessage = function (winnerIndex) {
  return playerName(winnerIndex) + " has won"
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
  state.status = original.status
  return state
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
    newState.status = wagerMessage(newState.nextPlayerIndex, wager)
    Object.freeze(newState)

    process.nextTick(function () {
      callback(null, newState)
    })
  }
}

exports.win = function (winnerIndex) {
  return function (state, callback) {
    var newState = copy(state)

    newState.winnerIndex = winnerIndex
    newState.status = victoryMessage(winnerIndex)

    async.map(
      state.scores, 
      function (score, done) {
        done(null, score - state.wager)
      },
      function (err, newScores) {
        newState.scores = newScores
        newState.scores[winnerIndex] += state.playerCount * state.wager
        Object.freeze(newState)
        callback(null, newState)
      }
    )
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
    scores: [],
    status: "Welcome to Nashville"
  }

  while (defaults.scores.length < playerCount) {
    defaults.scores.push(0)
  }

  var state = copy(defaults)

  if (spec) {
    Object.keys(spec).forEach(function (key) {
      state[key] = spec[key]
    })
  }

  Object.freeze(state)
  return state
}
