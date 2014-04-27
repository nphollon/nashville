"use strict";

var fs = require("fs")

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

exports["/"] = get("public/index.html")
exports["/index.css"] = get("public/index.css")
exports["/index.js"] = get("public/index.js")