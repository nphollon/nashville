;(function () {
	"use strict";

	var helpers = require("./spec_helper")
	var mock = helpers.mock
	var dummy = helpers.dummy
	var checkArgumentAndReturn = helpers.checkArgumentAndReturn
	var checkArgumentAndForward = helpers.checkArgumentAndForward
	var requireSource = helpers.requireSource

	var http = require("http")
	var application = requireSource("server/server")
	var routes = requireSource("server/routes")

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
			routes[getUrl] = { method: GET }
			routes[postUrl] = { method: POST, responseType: "text/plain" }

			router = application.buildRouter(routes)
			responseStream = mock(["writeHead", "end"])
		})

		afterEach(function () {
			expect(responseStream.writeHead.callCount).toBe(1)
			expect(responseStream.end).toHaveBeenCalled()
		})

		it("should return a 404 if the request url is invalid", function (done) {
			var requestStream = buildRequestStream(badUrl, GET)
			router.respond(requestStream, responseStream)
			process.nextTick(function () {
				expect(responseStream.writeHead).toHaveBeenCalledWith(404)
				done()
			})
		})

		it("should return a 405 if the request is a POST and the route accepts a GET", function (done) {
			var requestStream = buildRequestStream(getUrl, POST)
			router.respond(requestStream, responseStream)
			process.nextTick(function () {
				expect(responseStream.writeHead).toHaveBeenCalledWith(405)
				done()
			})
		})

		it("should return a 405 if the request is a GET and the route accepts a POST", function (done) {
			var requestStream = buildRequestStream(postUrl, GET)
			router.respond(requestStream, responseStream)
			process.nextTick(function () {
				expect(responseStream.writeHead).toHaveBeenCalledWith(405)
				done()
			})
		})

		it("should delegate request processing to correct route", function (done) {
			var requestBody = dummy()
			var responseBody = dummy()

			var responseType = "text/plain"
			routes[postUrl].processRequest = checkArgumentAndForward(requestBody, responseBody)
			routes[postUrl].responseType = responseType

			var requestStream = buildRequestStream(postUrl, POST, requestBody)

			router.respond(requestStream, responseStream)

			process.nextTick(function () {
				expect(responseStream.writeHead).toHaveBeenCalledWith(200, { "Content-Type": responseType })
				expect(responseStream.end).toHaveBeenCalledWith(responseBody)
				done()
			})
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
