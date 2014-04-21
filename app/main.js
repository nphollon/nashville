(function () {
	var application = require("./application.js")
	var port = 4567
	application.build(port)
	console.log("Server is listening on port " + port)
})()