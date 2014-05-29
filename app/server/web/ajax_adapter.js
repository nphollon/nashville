"use strict";

var events = require("../game/game_events")

exports.build = function (dispatcher) {
  var adapter = {}

  var stringifyResponse = function (callback) {
    return function (dispatcherError, state) {
      var response, errorResponse
      
      if (dispatcherError === null) {
        response = JSON.stringify({
          enableInput: true,
          wager: state.wager,
          score: state.score,
          status: state.status
        })

        errorResponse = null
      } else {
        errorResponse = JSON.stringify({
          status: dispatcherError.message
        })
      }

      process.nextTick(function () {
        callback(errorResponse, response)
      })
    }
  }

  adapter.requestUpdate = function (requestBody, callback) {
    process.nextTick(function () {
      dispatcher.requestUpdate(stringifyResponse(callback))
    })
  }

  adapter.submitDecision = function (requestBody, callback) {
    var jsonDecision = JSON.parse(requestBody)
    var decision = events.playerEvent(jsonDecision)

    process.nextTick(function () {
      dispatcher.submitDecision(decision, stringifyResponse(callback))
    })
  }

  return adapter
}