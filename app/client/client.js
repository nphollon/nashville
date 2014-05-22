"use strict";

exports.buildClient = function (requester, renderer, reader) {
	var client = {}

	var recordError = function (error) {
		console.log(error)
		renderer.error()
	}

	var processResponse = function (response) {
		renderer.render(response)

		if (response.enableInput === true) {
			reader.enable(client.submit)
		} else {
			process.nextTick(requestUpdate)
		}
	}

	client.start = function () {
		process.nextTick(requestUpdate)
		reader.disable()
	}

	client.update = function (error, response) {
		if (error === null) {
			processResponse(response)
		} else {
			recordError(error)
		}
	}

	client.submit = function (decision) {
		process.nextTick(function () {
			requester.submit(decision, client.update)
		})
		reader.disable()
	}
	
	var requestUpdate = requester.request.bind(requester, client.update)

	return client
}
