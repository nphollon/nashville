describe("The application", function () {
	"use strict";
	pending()
	var Browser = require("zombie")
	var helpers = require("./spec_helper")
	var applicationFactory = helpers.requireSource("server/application")

	var browser, application

	var port = 3000
	var url = "http://localhost:" + port + "/"

	var startApplication = function (substitutions) {
		application = applicationFactory.build(substitutions)
		application.start(port)
	}

	var logError = function (done, callback) {
		return function (error) {
			if (error) {
				console.log(error)
				done()
			} else {
				callback()
			}
		}
	}

	beforeEach(function () {
		helpers.setSpecTimeout(5000)
		browser = new Browser()
	})

	afterEach(function () {
		application.stop()
		helpers.resetSpecTimeout()
	})

	it("should let the user submit a decision and display the result", function (done) {
		var winningRandom = {
			integer: function () { return 0 }
		}

		startApplication({ random: winningRandom })

		browser.visit(url, logError(done, function () {
			expect(browser.text("#status")).toEqual("Place your bet.")
			expect(browser.text("#score")).toEqual("0")

			browser.fill("#wager", 5)
			browser.fire("#submit", "click", logError(done, function () {
				// opponent bets 1, user wins...
				// TODO need to add confirmation step
				expect(browser.text("#score")).toEqual("6")
				done()
			}))
		}))
	})

	xit("should cope with server-side errors gracefully", function (done) {
		var failingDispatcher = {
			requestUpdate: function (callback) {
				callback(new Error("dispatcher error"))
			},
			sendDispatch: helpers.dummy()
		}

		startApplication({ dispatcher: failingDispatcher })

		browser.visit(url, logError(done, function () {
			expect(browser.text("#status")).toEqual("We're sorry. Something went wrong.")
			done()
		}))
	})
})
