"use strict";

exports.requestUpdate = function (requestBody, callback) {
	var responseData = { wager: 5, score: 0, message: "Update" }
	callback(null, JSON.stringify(responseData))
}