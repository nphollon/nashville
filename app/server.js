"use strict"

var http = require("http")

exports.start = function (port) {
	var router = this.buildRouter(require("./routes"))
	return http.createServer(router.respond).listen(port)
}

exports.buildRouter = function (routes) {
	var router = {}

	router.respond = function (requestStream, responseStream) {
		var route = routes[requestStream.url]
		var responseWriter = buildResponseWriter(responseStream)

		if (route === undefined) {
			return responseWriter.invalidPath()
		}

		if (requestStream.method !== route.method) {
			return responseWriter.invalidMethod()
		}

		var responseBody = route.processRequest(requestStream.read(), responseWriter.success)
	}

	return router
}

var buildResponseWriter = function (responseStream) {
	var responseWriter = {
		success: function (err, body) { writeResponse(200, body) },
		invalidPath: function () { writeResponse(404) },
		invalidMethod: function () { writeResponse(405)	}
	}

	var writeResponse = function (statusCode, body) {
		responseStream.writeHead(statusCode)
		responseStream.end(body)
	}

	return responseWriter
}
