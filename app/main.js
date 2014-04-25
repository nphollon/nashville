(function () {
	"use strict"
	var application = require("./server.js")
	var port = 4567
	application.start(port)
	console.log("Server is listening on port " + port)
})()