"use strict";

exports.buildDispatcher = function () {
	var dispatcher = {}
	var mostRecentDispatch = null
	var mostRecentDecision = null
	var awaitingResponse = null

	var fulfillResponse = function () {
		process.nextTick(function () {
			awaitingResponse(null, mostRecentDispatch)
			awaitingResponse = null
		})
	}

	dispatcher.sendDispatch = function (dispatch, refereeCallback) {
		mostRecentDispatch = dispatch
		if (awaitingResponse !== null) {
			fulfillResponse()
		}
		if (mostRecentDecision !== null) {
			process.nextTick(function () {
				refereeCallback(null, mostRecentDecision)
				mostRecentDecision = null
			})
		}
	}

	dispatcher.requestUpdate = function (clientCallback) {
		awaitingResponse = clientCallback
		if (mostRecentDispatch !== null) {
			fulfillResponse()		
		}
	}
	
	dispatcher.submitDecision = function (decision) {
		mostRecentDecision = decision
	}

	return dispatcher
}