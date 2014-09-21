describe("The application", function () {
	"use strict";

	var Browser = require("zombie")
	var helpers = require("../spec_helper")
	var applicationFactory = helpers.requireSource("server/web/application")

	var browser, application, gameSubs

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
		gameSubs = {}
	})

	afterEach(function () {
		application.stop()
		helpers.resetSpecTimeout()
	})

	it("should let the user submit a decision and display the result", function (done) {
		gameSubs.random = {
			integer: function () { return 0 }
		}

		startApplication({ gameSubs: gameSubs })

		browser.visit(url, logError(done, function () {
			expect(browser.text("#status")).toEqual("Welcome to Nashville")
			expect(browser.text("#instruction")).toEqual("Place a wager")
			expect(browser.text("#player-1-score")).toEqual("0")
			expect(browser.text("#player-2-score")).toEqual("0")

			browser.fill("#wager", 5)
			browser.fire("#submit", "click", logError(done, function () {
				expect(browser.text("#status")).toEqual("Player 1 has won")
				expect(browser.text("#instruction")).toEqual("")
				expect(browser.text("#player-1-score")).toEqual("5")
				expect(browser.text("#player-2-score")).toEqual("-5")
				done()
			}))
		}))
	})

	it("should cope with server-side errors gracefully", function (done) {
		gameSubs.dispatcher = {
			requestUpdate: function (callback) {
				callback(new Error("dispatcher error"))
			},
			sendDispatch: helpers.dummy()
		}

		startApplication({ gameSubs: gameSubs })

		browser.visit(url, logError(done, function () {
			expect(browser.text("#status")).toEqual("We're sorry. Something went wrong.")
			done()
		}))
	})
})
