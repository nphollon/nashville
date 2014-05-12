describe("The application", function () {
	"use strict";
	var Browser = require("zombie")
	var requireSource = require("./spec_helper").requireSource
	var applicationFactory = requireSource("server/application")

	var browser, application, port

	beforeEach(function () {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000
		port = 3000
		application = applicationFactory.build()
		application.start(port)
		browser = new Browser()
	})

	it("should let the user submit a decision and display the result", function (done) {
		var playGame = function () {
			expect(browser.text("#status")).toEqual("Place your bet.")
			expect(browser.text("#score")).toEqual("0")

			browser.fill("#wager", 5)
			browser.fire("#submit", "click", function () {
				expect(browser.text("#score")).toEqual("5")
				done()
			})
		}

		var url = "http://localhost:" + port + "/"
		browser.visit(url, playGame)
	})

	afterEach(function () {
		application.stop()
	})
})
