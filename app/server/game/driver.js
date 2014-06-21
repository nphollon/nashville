"use strict";

var states = require("./states")

exports.build = function (dispatcher, stateManager) {
  var gameServer = {}

  gameServer.start = function (playerCount) {
    process.nextTick(function () {
      gameServer.getNextEvent(null, states.build(playerCount))
    })
  }

  gameServer.getNextEvent = function (error, gameState) {
    process.nextTick(function () {
      dispatcher.sendDispatch(gameState, function (error, event) {
        stateManager.advance(gameState, event, gameServer.getNextEvent)
      })
    })
  }

  return gameServer
}