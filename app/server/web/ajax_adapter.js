"use strict";

exports.build = function (dispatcher) {
  var adapter = {}

  var sendJsonTo = function (callback) {
    return function (error, response) {
      process.nextTick(function () {
        if (error === null) {
          callback(null, JSON.stringify(response))
        } else {
          callback(JSON.stringify({ status: error.message }))
        }
      })
    }
  }

  adapter.requestUpdate = function (requestBody, callback) {
    process.nextTick(function () {
      dispatcher.requestUpdate(sendJsonTo(callback))
    })
  }

  adapter.submitDecision = function (requestBody, callback) {
    var decision = JSON.parse(requestBody)

    process.nextTick(function () {
      dispatcher.submitDecision(decision, sendJsonTo(callback))
    })
  }

  return adapter
}