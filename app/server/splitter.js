"use strict";

exports.build = function (dispatcher) {
  var splitter = {}

  var splitDispatch = function (n, callback) {
    return function (error, data) {
      var response = (error === null) ? data[n] : undefined

      process.nextTick(function () {
        callback(error, response)
      })
    }
  }

  splitter.submitDecision = function (n) {
    return function (decision, callback) {
      var decisionList = [ decision ]
    
      process.nextTick(function () {
        dispatcher.submitDecision(decisionList, splitDispatch(n, callback))
      })
    }
  }

  splitter.requestUpdate = function (n) {
    return function (callback) {
      process.nextTick(function () {
        dispatcher.requestUpdate(splitDispatch(n, callback))
      })
    }
  }

  return splitter
}