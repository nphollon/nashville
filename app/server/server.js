"use strict";

var http = require("http")

exports.start = function (port) {
	var router = this.buildRouter(require("./routes"))
	return http.createServer(router.respond).listen(port)
}

var respondToInvalidPath = function (responseStream) {
	process.nextTick(function () {
		responseStream.writeHead(404)
		responseStream.end()
	})
}

var respondToInvalidMethod = function (responseStream) {
	process.nextTick(function () {
		responseStream.writeHead(405)
		responseStream.end()
	})
}

var writeToResponseStream = function (responseStream, route) {
	var headers = { "Content-Type": route.responseType }
	return function (error, body) {
		if (error !== null) {
			responseStream.writeHead(422, headers)
			responseStream.end(error)
		} else {
			responseStream.writeHead(200, headers)
			responseStream.end(body)
		}
	}
}

var respondToValidRequest = function (requestStream, responseStream, route) {
	process.nextTick(function () {
		route.processRequest(requestStream.read(), writeToResponseStream(responseStream, route))
	})
}

exports.buildRouter = function (routes) {
	var router = {}

	router.respond = function (requestStream, responseStream) {
		var route = routes[requestStream.url]

		if (route === undefined) {
			respondToInvalidPath(responseStream)
		} else if (requestStream.method !== route.method) {
			respondToInvalidMethod(responseStream)
		} else {
			respondToValidRequest(requestStream, responseStream, route)
		}
	}

	return router
}
