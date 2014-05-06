describe("The application", function () {
	"use strict";
	var Browser = require("zombie")
	var requireSource = require("./spec_helper").requireSource
	var application = requireSource("server/server")

	var browser, server, port

	beforeEach(function () {
		port = 3000
		server = application.start(port)
		browser = new Browser()
	})

	xit("should let the user submit a decision and display the result", function (done) {
		var playGame = function () {
			expect(browser.text("#status")).toEqual("Hello")
			expect(browser.text("#score")).toEqual("0")

			browser.fill("#wager", 5, function () {
				browser.pressButton("#submit", function () {
					expect(browser.text("#score")).toEqual("5")
					done()
				})
			})
		}

		var url = "http://localhost:" + port + "/"
		browser.visit(url, playGame)
	})

	afterEach(function () {
		server.close()
	})
})
