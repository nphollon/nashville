"use strict";

exports.buildClient = function (dependencies) {
	var reader = dependencies.reader
	var renderer = dependencies.renderer
	var requester = dependencies.requester

	var client = {}


	client.start = function () {
		process.nextTick(requestUpdate)
		reader.disable()
	}

	client.update = function (response) {
		renderer.render(response)

		if (response.enableInput === true) {
			reader.enable(client.submit)
		} else {
			process.nextTick(requestUpdate)
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
