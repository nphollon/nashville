"use strict";

exports.build = function () {
	var dispatcher = {}
	var mostRecentDispatch = null
	var mostRecentDecision = null
	var clientCallback = null
	var serverCallback = null

  var fulfillWithError = function (callback) {
    var error = new Error("Client submitted decision while waiting for an update")
    process.nextTick(function () {
      callback(error)
    })
  }

	var fulfillClientCallback = function () {
    if (mostRecentDispatch !== null && clientCallback !== null) {
  		process.nextTick(function () {
  			clientCallback(null, mostRecentDispatch)
  			clientCallback = null
  		})
      return true
    }
    return false
	}

	var fullfillRefereeCallback = function () {
    if (mostRecentDecision !== null && serverCallback !== null) {
  		process.nextTick(function () {
  			serverCallback(null, mostRecentDecision)
  			mostRecentDecision = null
        serverCallback = null
  		})
      return true
    }
    return false
	}

	dispatcher.sendDispatch = function (dispatch, callback) {
		mostRecentDispatch = dispatch
		serverCallback = callback

		if (!fullfillRefereeCallback()) {
			fulfillClientCallback()
    }
	}

	dispatcher.requestUpdate = function (callback) {
		clientCallback = callback
    fulfillClientCallback()
	}
	
	dispatcher.submitDecision = function (decision, callback) {
    if (clientCallback !== null) {
      return fulfillWithError(callback)
    }
    
    mostRecentDecision = decision
		clientCallback = callback
		fullfillRefereeCallback()
	}

	return dispatcher
}
