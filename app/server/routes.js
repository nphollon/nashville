"use strict";

var fs = require("fs")

var buildRoute = function (method, responseType, callback) {
	return {
		method: method,
		responseType: responseType,
		processRequest: callback
	}
}

exports.get = function (fileName, fileType) {
	return buildRoute("GET", fileType, function (requestBody, callback) {
		fs.readFile(fileName, callback)
	})	
}

exports.post = function (callback) {
	return buildRoute("POST", "application/json", callback)
}
