var http = require("http")

exports.start = function (port, router) {
	return http.createServer(router).listen(port)
}

exports.buildRouter = function (routes) {
	var router = {}

	router.respond = function (requestStream, responseStream) {
		var statusCode
		if (requestStream.url in routes) {
			statusCode = 405
		} else {
			statusCode = 404
		}

		responseStream.writeHead(statusCode)
		responseStream.end()
	}

	return router
}

exports.respond = function (request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain'})
  response.end('Hello World\n')
}

