"use strict";

exports.buildDispatcher = function () {
	var dispatcher = {}
	var mostRecentDispatch = null
	var mostRecentDecision = null
	var clientCallback = null

	var fulfillClientCallback = function () {
		process.nextTick(function () {
			clientCallback(null, mostRecentDispatch)
			clientCallback = null
		})
	}

	var fullfillRefereeCallback = function (refereeCallback) {
		process.nextTick(function () {
			refereeCallback(null, mostRecentDecision)
			mostRecentDecision = null
		})
	}

	dispatcher.sendDispatch = function (dispatch, callback) {
		mostRecentDispatch = dispatch
		
		if (mostRecentDecision !== null) {
			fullfillRefereeCallback(callback)
		} else if (clientCallback !== null) {
			fulfillClientCallback()
		}
	}

	dispatcher.requestUpdate = function (callback) {
		clientCallback = callback
		if (mostRecentDispatch !== null) {
			fulfillClientCallback()		
		}
	}
	
	dispatcher.submitDecision = function (decision, callback) {
		mostRecentDecision = decision
		clientCallback = callback
	}

	return dispatcher
}