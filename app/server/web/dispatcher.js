"use strict";

exports.build = function () {
	var dispatcher = {}
	var mostRecentDispatch, serverCallback

  var defaultSubmitCallback = function () {}
  var submitCallback = defaultSubmitCallback

  var fulfillSubmitCallback = function (error, data) {
    submitCallback(error, data)
    submitCallback = defaultSubmitCallback
  }

  var serverHasStarted = function () {
    return serverCallback !== undefined
  }

  var serverExpectingDecision = function () {
    return (submitCallback === defaultSubmitCallback) && serverHasStarted()
  }

	dispatcher.sendDispatch = function (dispatch, callback) {
    process.nextTick(function () {
  		mostRecentDispatch = dispatch
      serverCallback = callback
      fulfillSubmitCallback(null, dispatch)
    })
	}

  dispatcher.sendError = function (error) {
    process.nextTick(function() {
      fulfillSubmitCallback(error)
    })
  }

	dispatcher.requestUpdate = function (callback) {
    if (serverHasStarted()) {
      process.nextTick(function () {
        callback(null, mostRecentDispatch)
      })
    } else {
      setTimeout(function () {
        dispatcher.requestUpdate(callback)
      }, 10)
    }
	}

  dispatcher.submitDecision = function (decision, callback) {
    process.nextTick(function () {
      if (serverExpectingDecision()) {
        submitCallback = callback
        serverCallback(null, decision)
      } else {
        callback(new Error("Game server received unexpected client submission."))
      }
    })
  }

	return dispatcher
}
