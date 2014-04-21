

describe("The application", function () {
	var http, server, port, application, mock, dummy

	beforeEach(function () {
			http = require("http")
			application = require("../app/application")

			var helpers = require("./spec_helper.js")
			mock = helpers.mock
			dummy = helpers.dummy
	
			port = 1234
			
			server = mock(["listen"])		
			spyOn(http, "createServer").andReturn(server)
	})

	describe("building a server", function () {
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
})