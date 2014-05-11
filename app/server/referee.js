"use strict";

exports.build = function (dispatcher, stateManager, chancePlayer) {
  var gameState = null
  var referee = {}

  var updateDispatcher = function () {
    process.nextTick(function () {
      dispatcher.sendDispatch(gameState, updateGame)
    })
  }

  var updateGame = function (error, gameEvent) {
    process.nextTick(function () {
      stateManager.advance(gameState, gameEvent, referee.getNextEvent)
    })
  }

  referee.start = function () {
    process.nextTick(function () {
      stateManager.initialize(referee.getNextEvent)
    })
  }

  referee.getNextEvent = function (error, newGameState) {
    gameState = newGameState
    if (gameState.needChanceEvent === true) {
      updateGame(null, chancePlayer.getNextEvent())
    } else {
      updateDispatcher()
    }
  }

  return referee
}