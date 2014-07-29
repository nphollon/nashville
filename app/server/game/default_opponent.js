"use strict";

var events = require("./events")
var player = require("./base_player")

exports.defaultDecider = function () {
  var decision = events.playerEvent({ wager: 1 })
  
  return function (state, callback) {
    process.nextTick(function () {
      callback(decision)
    })
  }  
}

exports.build = function (inputCallbacks) {
  return player.build(inputCallbacks, exports.defaultDecider())
}