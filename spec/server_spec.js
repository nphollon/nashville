;(function () {
	"use strict"

	var http = require("http")
	var application = require("../app/server")
	var routes = require("../app/routes")
	var helpers = require("./spec_helper.js")

	var mock = helpers.mock
	var dummy = helpers.dummy
	var checkArgumentAndReturn = helpers.checkArgumentAndReturn
	var checkArgumentAndForward = helpers.checkArgumentAndForward

	describe("Starting a server", function () {
		var server, port, router

		beforeEach(function () {
				port = 1234
				server = mock(["listen"])
				router = { respond: dummy() }

				spyOn(application, "buildRouter")
					.andCallFake(checkArgumentAndReturn(routes, router))
				spyOn(http, "createServer")
					.andCallFake(checkArgumentAndReturn(router.respond, server))
		})
			
		it("should create a server listening on the correct port", function () {
			application.start(port)
			expect(server.listen).toHaveBeenCalledWith(port)
		})

		it("should return a server", function () {
			var listeningServer = dummy()
			server.listen.andReturn(listeningServer)
			expect(application.start(port, router)).toBe(listeningServer)
		})
	})

	describe("The router", function () {
		var routes, router, responseStream
		var getUrl, postUrl, badUrl, GET, POST

		beforeEach(function () {
			getUrl = "/valid_get"
			postUrl = "/valid_post"
			badUrl = "/invalid"
			GET = "GET"
			POST = "POST"

			routes = {}
			routes[getUrl] = { method: GET },
			routes[postUrl] = { method: POST }

			router = application.buildRouter(routes)
			responseStream = mock(["writeHead", "end"])
		})

		afterEach(function () {
			expect(responseStream.writeHead.callCount).toBe(1)
			expect(responseStream.end).toHaveBeenCalled()
		})

		it("should return a 404 if the request url is invalid", function () {
			var requestStream = buildRequestStream(badUrl, GET)
			router.respond(requestStream, responseStream)
			expect(responseStream.writeHead).toHaveBeenCalledWith(404)
		})

		it("should return a 405 if the request is a POST and the route accepts a GET", function () {
			var requestStream = buildRequestStream(getUrl, POST)
			router.respond(requestStream, responseStream)
			expect(responseStream.writeHead).toHaveBeenCalledWith(405)
		})

		it("should return a 405 if the request is a GET and the route accepts a POST", function () {
			var requestStream = buildRequestStream(postUrl, GET)
			router.respond(requestStream, responseStream)
			expect(responseStream.writeHead).toHaveBeenCalledWith(405)
		})

		it("should delegate request processing to correct route", function () {
			var requestBody = dummy()
			var responseBody = dummy()

			routes[postUrl].processRequest = checkArgumentAndForward(requestBody, responseBody)

			var requestStream = buildRequestStream(postUrl, POST, requestBody)

			router.respond(requestStream, responseStream)

			expect(responseStream.writeHead).toHaveBeenCalledWith(200)
			expect(responseStream.end).toHaveBeenCalledWith(responseBody)
		})
	})

	var buildRequestStream = function (url, method, body) {
		return {
			url: url,
			method: method,
			read: function () { return body }
		}
	}
})()
