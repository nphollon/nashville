;(function () {
	"use strict";
	var application = require("./server/server.js")
	var port = 4567
	application.start(port)
	console.log("Server is listening on port " + port)
})()