"use strict";

exports.buildDispatcher = function () {
	var dispatcher = {}
	var mostRecentDispatch = null

	dispatcher.sendDispatch = function (dispatch) {
		mostRecentDispatch = dispatch
	}

	dispatcher.requestUpdate = function (clientCallback) {
		if (mostRecentDispatch !== null) {
			process.nextTick(function () {
				clientCallback(null, mostRecentDispatch)
			})
		}
	}
	
	return dispatcher
}