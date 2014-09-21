;(function () {
	"use strict";

	var port = process.env.PORT || 4567

  var application = require("./web/application").build()

  application.start(port)
  
	console.log("Server is listening on port " + port)
}())