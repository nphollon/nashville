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

  adapter.requestUpdate = function (requestBody, callback) {
    process.nextTick(function () {
      dispatcher.requestUpdate(callback)
    })
  }

  adapter.submitDecision = function (requestBody, callback) {
    var decision = events.playerEvent(requestBody.wager)
    process.nextTick(function () {
      dispatcher.submitDecision(decision, callback)
    })
  }

  return adapter
}