;(function () {
	"use strict";
	var application = require("./server/server.js")
	var port = 4567
	
	process.nextTick(function () {
		application.start(port)
		console.log("Server is listening on port " + port)
	})
})()