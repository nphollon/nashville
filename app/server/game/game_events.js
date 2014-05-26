"use strict";

var gameEvent = { type: "game event" }

exports.chanceType = "chance"
exports.playerType = "player"

exports.playerEvent = function (wager) {
  var decision = Object.create(gameEvent)
  decision.type = exports.playerType
  decision.wager = wager
  Object.freeze(decision)
  return decision
}

exports.chanceEvent = function (userWins) {
  var decision = Object.create(gameEvent)
  decision.type = exports.chanceType
  decision.userWins = userWins
  Object.freeze(decision)
  return decision
}