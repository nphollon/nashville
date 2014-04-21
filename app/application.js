var http = require("http")

exports.build = function (port) {
	return http.createServer(this.respond).listen(port)
}

exports.respond = function (request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain'})
  response.end('Hello World\n')
}