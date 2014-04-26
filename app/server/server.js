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

/*
3 Types of routes:
--static content
  * GET
  * serves a file from the file system
  * no message processing necessary
--ajax communication
	* POST
	* sends request to callback
--errors
  * thrown by server if http request is invalid
  * thrown by static routes if file not found
  * thrown by ajax routes if malformed request
*/