"use strict";

exports.build = function (dispatcher, count) {
  var splitter = {}
  var decisions = []
  var callbacks = []

  var fulfillRequest = function (n, callback) {
    return function (error, data) {
      var response = (error === null) ? data[n] : undefined

      process.nextTick(function () {
        callback(error, response)
      })
    }
  }

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

  var processDispatch = function (error, data) {
    var fulfill

    if (error === null) {
      fulfill = fulfillWithData(data)
    } else {
      fulfill = fulfillWithError(error)
    }

    callbacks.forEach(fulfill)
    decisions = []
    callbacks = []
  }

  var allPlayersSubmitted = function () {
    // Why does this break unrelated tests when callbacks replaces decisions?
    return Object.keys(decisions).length === count
  }

  var registerSubmission = function (decision, callback, n) {
    if (decisions[n] !== undefined) {
      process.nextTick(function () {
        callback(new Error("Client submitted decision while waiting for an update"))
      })
    } else {
      decisions[n] = decision
      callbacks[n] = callback
    }
  }

  splitter.submitDecision = function (n) {
    return function (decision, callback) {
      registerSubmission(decision, callback, n)

      if (allPlayersSubmitted()) {
        process.nextTick(function () {
          dispatcher.submitDecision(decisions, processDispatch)
        })
      }
    }
  }

  splitter.requestUpdate = function (n) {
    return function (callback) {
      process.nextTick(function () {
        dispatcher.requestUpdate(fulfillRequest(n, callback))
      })
    }
  }

  return splitter
}