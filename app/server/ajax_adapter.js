"use strict";

var events = require("./game_events")

var returnDummyResponse = function (requestBody, callback) {
	var responseData = { wager: 5, score: 0, message: "Hello", enableInput: true }
	process.nextTick(function () {
		callback(null, JSON.stringify(responseData))
	})
}

exports.requestUpdate = returnDummyResponse
exports.submitDecision = returnDummyResponse

exports.build = function (dispatcher) {
  var adapter = {}

  var stringifyResponse = function (callback) {
    return function (error, state) {
      var response = {
        enableInput: true,
        wager: state.wager,
        score: state.score,
        status: state.status
      }

      process.nextTick(function () {
        callback(null, JSON.stringify(response))
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
    var decision = events.playerEvent(jsonDecision.wager)

    process.nextTick(function () {
      dispatcher.submitDecision(decision, stringifyResponse(callback))
    })
  }

  return adapter
}