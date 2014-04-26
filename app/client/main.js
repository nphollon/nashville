;(function () {
	var $ = require("jquery")

	$(document).ready(function () {
		var clientLib = require("./client")

		var urls = {
			requestUrl: "/request-update",
			submitUrl: "/submit-decision"
		}
		var interfaceElements = {
			statusDiv: $("h2"),
			scoreDiv: $("#score"),
			wagerField: $("#wager"),
			submitButton: $("#submit")
		}

		var requester = clientLib.buildRequester($, urls)
		var renderer = clientLib.buildRenderer(interfaceElements)
		var reader = clientLib.buildReader(interfaceElements)
		
		var client = clientLib.buildClient(requester, renderer, reader)
		client.start()
	})
})()