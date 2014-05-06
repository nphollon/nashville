"use strict";

exports.buildReferee = function (dispatcher, stateManager, chancePlayer) {
  var referee = {}

  referee.start = function () {
    process.nextTick(function () {
      stateManager.initialize(referee.queryNextPlayer)
    })
  }

  referee.queryNextPlayer = function (game) {
    if (game.needChanceEvent) {
      var event = chancePlayer.getNextEvent()
      process.nextTick(function () {
        stateManager.advance(game.state, event, referee.queryNextPlayer)
      })
    } else {
      process.nextTick(function () {
        dispatcher.sendDispatch(game.state, undefined)
      })
    }
  }

  return referee
}