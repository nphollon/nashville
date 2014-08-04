"use strict";

var async = require("async")
var zipMap = require("../../util/async").zipMap

exports.build = function (dispatcher, count) {
  var splitter = {}
  var decisions = []
  var submitCallbacks = []

  var fulfillWithError = function (error) {
    return function (callback, done) {
      process.nextTick(callback.bind(null, error))
      done()
    }
  }

  var fulfillWithData = function (callback, data, done) {
    process.nextTick(callback.bind(null, null, data))
    done()
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

  var reset = function () {
    submitCallbacks = []
    decisions = []
  }
  
  var fulfillSubmitCallbacks = function (error, data) {
    if (error === null) {
      zipMap([submitCallbacks, data], fulfillWithData, reset)
    } else {
      async.each(submitCallbacks, fulfillWithError(error), reset)
    }
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