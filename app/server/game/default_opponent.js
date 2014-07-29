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
