"use strict";

var gameEvent = { type: "game event" }

exports.chanceType = "chance"
exports.playerType = "player"

exports.playerEvent = function (decision) {
  var event = Object.create(gameEvent)
  event.type = exports.playerType
  event.wager = parseInt(decision.wager, 10)
  Object.freeze(event)
  return event
}

exports.chanceEvent = function (userWins) {
  var event = Object.create(gameEvent)
  event.type = exports.chanceType
  event.userWins = userWins
  Object.freeze(event)
  return event
}