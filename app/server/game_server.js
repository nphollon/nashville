"use strict";

exports.build = function (dispatcher, stateManager, chancePlayer) {
  var gameState = null
  var gameServer = {}

  var updateDispatcher = function () {
    process.nextTick(function () {
      dispatcher.sendDispatch(gameState, updateGame)
    })
  }

  var updateGame = function (error, gameEvent) {
    process.nextTick(function () {
      stateManager.advance(gameState, gameEvent, gameServer.getNextEvent)
    })
  }

  gameServer.start = function () {
    process.nextTick(function () {
      stateManager.initialize(gameServer.getNextEvent)
    })
  }

  gameServer.getNextEvent = function (error, newGameState) {
    gameState = newGameState
    if (gameState.needChanceEvent === true) {
      updateGame(null, chancePlayer.getNextEvent())
    } else {
      updateDispatcher()
    }
  }

  return gameServer
}