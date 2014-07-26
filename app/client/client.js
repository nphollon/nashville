"use strict";

exports.buildClient = function (requester, renderer, reader) {
	var client = {}

	var recordError = function (error) {
		console.log(error)
		renderer.error()
	}

	var processResponse = function (response) {
		renderer.render(response)

		if (response.input.enableSubmit === true) {
			reader.enable(response.input, client.submit)
		} else {
			client.submit({})
		}
	}

	client.start = function () {
		reader.disable()
		requester.request(client.update)
	}

	client.update = function (error, response) {
		if (error) {
			recordError(error)
		} else {
			processResponse(response)
		}
	}

	client.submit = function (decision) {
		reader.disable()
		requester.submit(decision, client.update)
	}

	return client
}
