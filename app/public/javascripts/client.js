"use strict"

var buildClient = function (requester, renderer, reader) {
	var client = {}

	client.start = function () {
		requester.request(client.update)
		reader.disable()
	}

	client.update = function (response) {
		renderer.render(response)

		if (response.enableInput === true) {
			reader.enable(client.submit)
		} else {
			requester.request(client.update)
		}
	}

	client.submit = function (decision) {
		requester.submit(decision, client.update)
		reader.disable()
	}

	return client
}