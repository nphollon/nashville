$(document).ready(function () {
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

	var requester = buildRequester($, urls)
	var renderer = buildRenderer(interfaceElements)
	var reader = buildReader(interfaceElements)
	
	var client = buildClient(requester, renderer, reader)
	client.start()
})