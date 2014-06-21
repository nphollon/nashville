"use strict";

exports.build = function (dispatcher, count) {
  var splitter = {}
  var decisions = []
  var submitCallbacks = []

  var fulfillWithError = function (error) {
    return function (callback) {
      process.nextTick(function () {
        callback(error)
      })
    }
  }

  var fulfillWithData = function (data) {
    return function (callback, index) {
      process.nextTick(function () {
        callback(null, data[index])
      })
    }
  }

  var fulfillRequestCallback = function (callback, n) {
    return function (error, data) {
      process.nextTick(function () {
        if (error === null) {
          callback(null, data[n])
        } else {
          callback(error)
        }
      })
    }
  }

  var fulfillSubmitCallbacks = function (error, data) {
    var fulfill

    if (error === null) {
      fulfill = fulfillWithData(data)
    } else {
      fulfill = fulfillWithError(error)
    }

    submitCallbacks.forEach(fulfill)
    submitCallbacks = []
    decisions = []
  }

  var allPlayersSubmitted = function () {
    return Object.keys(decisions).length === count
  }

  var registerSubmission = function (decision, callback, n) {
    if (decisions[n] !== undefined) {
      process.nextTick(function () {
        callback(new Error("Client submitted decision while waiting for an update"))
      })
    } else {
      decisions[n] = decision
      submitCallbacks[n] = callback
    }
  }

  var submitDecision = function (n) {
    return function (decision, callback) {
      registerSubmission(decision, callback, n)

      if (allPlayersSubmitted()) {
        process.nextTick(function () {
          dispatcher.submitDecision(decisions, fulfillSubmitCallbacks)
        })
      }
    }
  }

  var requestUpdate = function (n) {
    return function (callback) {
      process.nextTick(function () {
        dispatcher.requestUpdate(fulfillRequestCallback(callback, n))
      })
    }
  }

  splitter.input = function (n) {
    return {
      submitDecision: submitDecision(n),
      requestUpdate: requestUpdate(n)
    }
  }

  return splitter
}