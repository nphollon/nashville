"use strict";

var http = require("http")

exports.start = function (port, router) {
	return http.createServer(router.respond).listen(port)
}

