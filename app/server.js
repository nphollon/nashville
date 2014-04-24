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

exports.routeMapper = function () {
	var mapper = {
		routes: { },

		post: function (url, callback) {
			this.routes[url] = buildRoute("POST", callback)
			return this
		},
		
		get: function (url, callback) {
			this.routes[url] = buildRoute("GET", callback)
			return this
		}
	}

	var buildRoute = function (method, callback) {
		return { method: method, processRequest: callback }
	}

	return mapper
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
