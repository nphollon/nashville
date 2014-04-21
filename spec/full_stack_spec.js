"use strict"

var Browser = require("zombie")

var application = require("../app/application.js")

describe("The application", function () {
	var browser, server

	it("should let the user submit a decision and display the result", function () {
		var port = 3000
		var fakeRNG = {
			getBoolean: function () {
				return true
			}
		}

		server = application.build(port, fakeRNG)


		var url = "http://localhost:" + port + "/"
		browser = new Browser()
		browser.visit(url, playGame)
	})

	var playGame = function () {
			// wait for message to change
			// score should be 0
			// set wager to 5
			// click submit
			// wait for message to change
			// score should be 5
		done()
	}
})
