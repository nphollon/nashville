"use strict";

exports.requestUpdate = function (requestBody, callback) {
	var responseData = { wager: 5, score: 0, message: "Update", enableInput: true }
	process.nextTick(function () {
		callback(null, JSON.stringify(responseData))
	})
}