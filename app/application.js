var http = require("http")

exports.start = function (port, router) {
	return http.createServer(router).listen(port)
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

		var responseBody = route.processRequest(requestStream.read())
		return responseWriter.success(responseBody)
	}

	return router
}

exports.respond = function (request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain'})
	response.end('Hello World\n')
}

var buildResponseWriter = function (responseStream) {
	var responseWriter = {
		success: function (body) { writeResponse(200, body) },
		invalidPath: function () { writeResponse(404) },
		invalidMethod: function () { writeResponse(405)	}
	}

	var writeResponse = function (statusCode, body) {
		responseStream.writeHead(statusCode)
		responseStream.end(body)
	}

	return responseWriter
}
