"use strict";

var events = require("./events")

exports.defaultDecider = function () {
  var decision = events.playerEvent({ wager: 1 })
  
  return function (state, callback) {
    process.nextTick(function () {
      callback(decision)
    })
  }  
}

exports.martingaleDecider = function () {
  var bestScore = 0

  return function (state, callback) {
    var currentScore = state.scores[state.playerIndex]

    if (currentScore > bestScore) {
      bestScore = currentScore
    }

    var wager = bestScore - currentScore + 1
    var decision = events.playerEvent({ wager: wager })
    
    process.nextTick(function () {
      callback(decision)
    })
  }
}