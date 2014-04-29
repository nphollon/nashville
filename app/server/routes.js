"use strict";

var fs = require("fs")
var ajaxResources = require("./ajax_resources")

var buildRoute = function (method, callback) {
	return {
		method: method,
		processRequest: callback
	}
}

var get = function (filename) {
	return buildRoute("GET", function (requestBody, callback) {
		fs.readFile(filename, callback)
	})	
}

var post = function (callback) {
	return buildRoute("POST", callback)
}

exports["/"] = get("public/index.html")
exports["/index.css"] = get("public/index.css")
exports["/index.js"] = get("public/index.js")
exports["/request-update"] = post(ajaxResources.requestUpdate)