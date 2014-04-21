"use strict"

var Browser, application

;(function () {
	Browser = require("zombie")
	application = require("../app/application.js")
})()

describe("The application", function () {
	var browser, server, port, rng

	beforeEach(function () {
		port = 3000
		rng = {
			getBoolean: function () {
				return true
			}
		}

		server = application.build(port, rng)
		browser = new Browser()
	})

	it("should let the user submit a decision and display the result", function (done) {
		var playGame = function () {
				// wait for message to change
				// score should be 0
				// set wager to 5
				// click submit
				// wait for message to change
				// score should be 5
			done()
		}

		var url = "http://localhost:" + port + "/"
		browser.visit(url, playGame)
	})

	afterEach(function () {
		server.close()
	})
})
