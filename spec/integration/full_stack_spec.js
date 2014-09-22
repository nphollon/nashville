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

	var logError = function (done) {
		return function (error) {
			console.log(error)
			done()
		}
	}

	beforeEach(function () {
		helpers.setSpecTimeout(5000)

		browser = new Browser()

		gameSubs = {
			random: {
				integer: function () { return 0 }
			}
		}
	})

	afterEach(function () {
		application.stop()
		helpers.resetSpecTimeout()
	})

	it("should let the user submit a decision and display the result", function (done) {
		var firstSessionCookie, secondSessionCookie

		startApplication({ gameSubs: gameSubs })

		// When the user visits the homepage
		// Then the user should see a new game
		browser.visit(url)
			.fail(logError(done))
			.then(function () {
				expect(browser.text("#status")).toEqual("Welcome to Nashville")
				expect(browser.text("#instruction")).toEqual("Place a wager")
				expect(browser.text("#player-1-score")).toEqual("0")
				expect(browser.text("#player-2-score")).toEqual("0")

				// Given the user's score is 0
				// When the user submits a wager of 5
				// And they win
				// Then the user's score should be updated to +5
				return browser.fill("#wager", 5)
			})
			.then(function () {
				return browser.fire("#submit", "click")
			})
			.fail(logError(done))
			.then(function() {
				expect(browser.text("#status")).toEqual("Player 1 has won")
				expect(browser.text("#instruction")).toEqual("")
				expect(browser.text("#player-1-score")).toEqual("5")
				expect(browser.text("#player-2-score")).toEqual("-5")

				// Given a game is in progress
				// When the session cookie is deleted
				// And the user refreshes the page
				// Then the user should see a new game
				firstSessionCookie = browser.getCookie("session")
				browser.deleteCookies()
				return browser.visit(url)
			})
			.fail(logError(done))
			.then(function () {

				expect(browser.text("#status")).toEqual("Welcome to Nashville")
				expect(browser.text("#instruction")).toEqual("Place a wager")
				expect(browser.text("#player-1-score")).toEqual("0")
				expect(browser.text("#player-2-score")).toEqual("0")

				// Given a game is in progress
				// When the session cookie for a different game is loaded
				// And the user refreshes the page
				// Then the user should see the other game
				secondSessionCookie = browser.getCookie("session")
				browser.setCookie("session", firstSessionCookie)
				return browser.visit(url)
			})
			.fail(logError(done))
			.then(function() {
				expect(browser.text("#status")).toEqual("Player 1 has won")
				expect(browser.text("#instruction")).toEqual("")
				expect(browser.text("#player-1-score")).toEqual("5")
				expect(browser.text("#player-2-score")).toEqual("-5")

				done()
			})
	})

	it("should cope with server-side errors gracefully", function (done) {
		gameSubs.dispatcher = {
			requestUpdate: function (callback) {
				callback(new Error("dispatcher error"))
			},
			sendDispatch: helpers.dummy()
		}

		startApplication({ gameSubs: gameSubs })

		browser.visit(url)
			.fail(logError(done))
			.then(function () {
				expect(browser.text("#status")).toEqual("We're sorry. Something went wrong.")
				done()
			})
	})
})
