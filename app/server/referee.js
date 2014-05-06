"use strict";

exports.buildReferee = function (dispatcher) {
  var referee = {}

  referee.start = function (game) {
    process.nextTick(function () {
      dispatcher.sendDispatch(game, referee.updateGame)
    })
  }

  return referee
}