/* jshint browser: true */

;(function () {
	"use strict";
	
	var $ = require("jquery")
	var clientLib = require("./client")

	var urls = {
		requestUrl: "/request-update",
		submitUrl: "/submit-decision"
	}

	var interfaceElements = {
		statusDiv: $("#status"),
		scoreDiv: $("#score"),
		wagerField: $("#wager"),
		submitButton: $("#submit")
	}

	$(document).ready(function () {
		var requester = clientLib.buildRequester($, urls)
		var renderer = clientLib.buildRenderer(interfaceElements)
		var reader = clientLib.buildReader(interfaceElements)
		
		var client = clientLib.buildClient(requester, renderer, reader)
		
		process.nextTick(function () {
			client.start()
		})
	})
})()
