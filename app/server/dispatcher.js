"use strict";

exports.buildDispatcher = function () {
	var dispatcher = {}
	var mostRecentDispatch = null
	var awaitingResponse = null

	var fulfillResponse = function () {
		process.nextTick(function () {
			awaitingResponse(null, mostRecentDispatch)
			awaitingResponse = null
		})
	}

	dispatcher.sendDispatch = function (dispatch) {
		mostRecentDispatch = dispatch
		if (awaitingResponse !== null) {
			fulfillResponse()
		}
	}

	dispatcher.requestUpdate = function (clientCallback) {
		awaitingResponse = clientCallback
		if (mostRecentDispatch !== null) {
			fulfillResponse()		
		}
	}
	
	return dispatcher
}