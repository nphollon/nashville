;(function () {
	"use strict"

	var home_page = require("../app/home_page")

	describe("rendering the home page", function () {
		it("should return some html", function (done) {
			home_page.render("", function (err, html) {
				expect(err).toBe(null)
				expect(html).toMatch(/^\s*<html>[\S\s]*<\/html>\s*$/)
				done()
			})
		})
	})
})()

