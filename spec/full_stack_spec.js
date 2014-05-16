describe("The application", function () {
	"use strict";
	var Browser = require("zombie")
	var helpers = require("./spec_helper")
	var applicationFactory = helpers.requireSource("server/application")

	var browser, application

	var port = 3000

	var substitutions = {
		random: {
			bool: function () { return true }
		}
	}

	beforeEach(function () {
		helpers.setSpecTimeout(5000)

		application = applicationFactory.build(substitutions)
		application.start(port)

		browser = new Browser()
	})

	afterEach(function () {
		helpers.resetSpecTimeout()
	})

	it("should let the user submit a decision and display the result", function (done) {
		var playGame = function (error) {
			if (error) {
				console.log(error)
				done()
			}

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
