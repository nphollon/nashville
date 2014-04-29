;(function () {
	"use strict";

	var helpers = require("./spec_helper")
	//var dummy = helpers.dummy
	var resources = helpers.requireSource("server/ajax_resources")

	describe("requesting an update", function () {
		it("should return a dummy response body", function (done) {
			resources.requestUpdate("{}", function (err, response) {
				expect(err).toBe(null)
				var responseData = JSON.parse(response)
				expect(responseData.wager).toBe(5)
				expect(responseData.score).toBe(0)
				expect(responseData.message).toBe("Update")
				expect(responseData.enableInput).toBe(true)
				done()
			})
		})
	})
})()