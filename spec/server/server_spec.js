describe("Starting a server", function () {
	"use strict";

	var helpers = require("../spec_helper")
	var mock = helpers.mock
	var dummy = helpers.dummy
	var checkArgumentAndReturn = helpers.checkArgumentAndReturn

	var http = require("http")
	var application = helpers.requireSource("server/server")

	var server, port, router

	beforeEach(function () {
			port = 1234
			server = mock(["listen"])
			router = { respond: dummy() }

			spyOn(http, "createServer")
				.and.callFake(checkArgumentAndReturn(router.respond, server))
	})
		
	it("should create a server listening on the correct port", function () {
		application.start(port, router)
		expect(server.listen).toHaveBeenCalledWith(port)
	})

	it("should return a server", function () {
		var listeningServer = dummy()
		server.listen.and.returnValue(listeningServer)
		expect(application.start(port, router)).toBe(listeningServer)
	})
})