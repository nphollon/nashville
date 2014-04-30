"use strict";

exports.buildClient = function (requester, renderer, reader) {
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

exports.buildRequester = function ($, urls) {
	var requester = {}

	var sendResponseTo = function (callback) {
		return function (data) {
			process.nextTick(function () {
				callback(JSON.parse(data))
			})
		}
	}

	var post = function (url, postObject, callback) {
		var postBody = JSON.stringify(postObject)
		$.post(url, postBody, sendResponseTo(callback))
	}

	requester.request = function (callback) {
		post(urls.requestUrl, {}, callback)
	}

	requester.submit = function (decision, callback) {
		post(urls.submitUrl, decision, callback)
	}

	return requester
}

exports.buildReader = function (interfaceElements) {
	var reader = {}

	var submitButton = interfaceElements.submitButton
	var wagerField = interfaceElements.wagerField

	reader.enable = function (callback) {
		setButtonDisabled(false)
		submitButton.click(this.buildOnClickCallback(callback))
	}

	reader.disable = function () {
		setButtonDisabled(true)
		submitButton.off("click")
	}

	reader.buildOnClickCallback = function (clientCallback) {
		var decision = this.getDecision()
		return function () {
			clientCallback(decision)
		}
	}

	reader.getDecision = function () {
		return { wager: parseInt(wagerField.val()) }
	}

  var setButtonDisabled = function (isDisabled) {
  	submitButton.attr("disabled", isDisabled.toString())
	}

	return reader
}

exports.buildRenderer = function (interfaceElements) {
	var renderer = {}	

	renderer.render = function (data) {
		interfaceElements.wagerField.val(data.wager)
		interfaceElements.statusDiv.text(data.message)
		interfaceElements.scoreDiv.text(data.score)
	}

	return renderer
}