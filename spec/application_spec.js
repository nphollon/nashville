"use strict"

var http, application, mock, dummy

;(function () {
	http = require("http")
	application = require("../app/application")

	var helpers = require("./spec_helper.js")
	mock = helpers.mock
	dummy = helpers.dummy
})()

describe("building a server", function () {
	var server, port

	beforeEach(function () {
			port = 1234
			server = mock(["listen"])
			spyOn(http, "createServer").andCallFake(function (callback) {
				return (callback === application.respond) ? server : undefined
			})
	})
		
	it("should create a server listening on the correct port", function () {
		application.build(port)
		expect(server.listen).toHaveBeenCalledWith(port)
	})

	it("should return a server", function () {
		var listeningServer = dummy()
		server.listen.andReturn(listeningServer)
		expect(application.build(port)).toBe(listeningServer)
	})
})

describe("responding to a request", function () {
	
})