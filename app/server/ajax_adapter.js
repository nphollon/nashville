"use strict";

var returnDummyResponse = function (requestBody, callback) {
	var responseData = { wager: 5, score: 0, message: "Update", enableInput: true }
	process.nextTick(function () {
		callback(null, JSON.stringify(responseData))
	})
}

exports.requestUpdate = returnDummyResponse
exports.submitDecision = returnDummyResponse