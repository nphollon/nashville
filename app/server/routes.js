"use strict";

var fs = require("fs")
var ajaxResources = require("./ajax_adapter")

var buildRoute = function (method, responseType, callback) {
	return {
		method: method,
		responseType: responseType,
		processRequest: callback
	}
}

var get = function (fileName, fileType) {
	return buildRoute("GET", fileType, function (requestBody, callback) {
		fs.readFile(fileName, callback)
	})	
}

var post = function (callback) {
	return buildRoute("POST", "application/json", callback)
}

exports["/"] = get("public/index.html", "text/html")
exports["/index.css"] = get("public/index.css", "text/css")
exports["/index.js"] = get("public/index.js", "application/javascript")
exports["/request-update"] = post(ajaxResources.requestUpdate)
exports["/submit-decision"] = post(ajaxResources.submitDecision)