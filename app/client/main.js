/* jshint browser: true */

;(function () {
	"use strict";
	
	var $ = require("jquery")

	var urls = {
		requestUrl: "/request-update",
		submitUrl: "/submit-decision"
	}

	$(document).ready(function () {

		var interfaceElements = {
			statusDiv: $("#status"),
			instructionDiv: $("#instruction"),
			playerPanels: [
				{
					score: $("#player-1-score"),
					card: $("#player-1-card")
				},
				{
					score: $("#player-2-score"),
					card: $("#player-2-card")
				}
			],
			wagerField: $("#wager"),
			submitButton: $("#submit"),
			errorDiv: $("#error")
		}
		
		var requester = require("./requester").buildRequester($, urls)
		var renderer = require("./renderer").buildRenderer(interfaceElements)
		var reader = require("./reader").buildReader(interfaceElements)
		
		var client = require("./client").buildClient(requester, renderer, reader)
		
		process.nextTick(function () {
			client.start()
		})
	})
})()
