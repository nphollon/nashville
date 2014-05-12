"use strict";

var events = require("./game_events")

exports.build = function (dispatcher, stateManager, chancePlayer) {
  var gameServer = {}

  var gameState = null

  var advanceGame = function (event) {
    stateManager.advance(gameState, event, gameServer.getNextEvent)
  }

  var dispatcherCallback = function (error, event) {
    process.nextTick(function () {
      advanceGame(event)
    })
  }

  var update = {}

  update[events.chanceType] = advanceGame

  update[events.playerType] = function () {
    dispatcher.sendDispatch(gameState, dispatcherCallback)
  }

  gameServer.start = function () {
    process.nextTick(function () {
      stateManager.initialize(gameServer.getNextEvent)
    })
  }

  gameServer.getNextEvent = function (error, newGameState) {
    gameState = newGameState

    process.nextTick(function () {
      update[gameState.nextEventType].call(null, chancePlayer.getNextEvent())
    })
  }

  return gameServer
}