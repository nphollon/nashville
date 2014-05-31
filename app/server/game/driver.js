"use strict";

var events = require("./events")

exports.build = function (dispatcher, stateManager, chancePlayer) {
  var gameServer = {}
  var eventGetter = {}
  var gameState = null

  var advanceGame = function (error, event) {
    stateManager.advance(gameState, event, gameServer.getNextEvent)
  }

  eventGetter[events.chanceType] = function () {
    chancePlayer.getNextEvent(gameState, advanceGame)
  }

  eventGetter[events.playerType] = function () {
    dispatcher.sendDispatch(gameState, advanceGame)    
  }

  gameServer.start = function () {
    process.nextTick(function () {
      stateManager.initialize(gameServer.getNextEvent)
    })
  }

  gameServer.getNextEvent = function (error, newGameState) {
    gameState = newGameState

    process.nextTick(eventGetter[gameState.nextEventType])
  }

  return gameServer
}