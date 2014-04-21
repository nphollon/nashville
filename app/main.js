(function () {
	var application = require("./application.js")
	var port = 9292
	application.build(port)
	console.log("Server is listening on port " + port)
})()