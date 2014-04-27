;(function () {
	"use strict";
	
	var Browser = require("zombie")
	var requireSource = require("./spec_helper").requireSource
	var application = requireSource("server/server")

	describe("The application", function () {
		var browser, server, port

		beforeEach(function () {
			port = 3000
			server = application.start(port)
			browser = new Browser()
		})

		it("should let the user submit a decision and display the result", function (done) {
			var playGame = function () {
				expect(browser.text("#status")).toEqual("Hello")
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
})()
