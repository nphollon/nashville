"use strict"

var http, application, mock, dummy

;(function () {
	http = require("http")
	application = require("../app/server")

	var helpers = require("./spec_helper.js")
	mock = helpers.mock
	dummy = helpers.dummy
})()

describe("starting a server", function () {
	var server, port, router

	beforeEach(function () {
			port = 1234
			server = mock(["listen"])
			router = dummy()
			spyOn(http, "createServer").andCallFake(function (callback) {
				return (callback === router) ? server : undefined
			})
	})
		
	it("should create a server listening on the correct port", function () {
		application.start(port, router)
		expect(server.listen).toHaveBeenCalledWith(port)
	})

	it("should return a server", function () {
		var listeningServer = dummy()
		server.listen.andReturn(listeningServer)
		expect(application.start(port, router)).toBe(listeningServer)
	})
})

describe("The router", function () {
	describe("responding to a request", function () {
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
			var requestStream = buildRequestStream(postUrl, POST, requestBody)
			routes[postUrl].processRequest = function (data) {
				return (data === requestBody) ? responseBody : undefined
			}

			router.respond(requestStream, responseStream)

			expect(responseStream.writeHead).toHaveBeenCalledWith(200)
			expect(responseStream.end).toHaveBeenCalledWith(responseBody)
		})
	})
})

describe("The routes", function () {
	it("should initially be empty", function () {
		var routes = application.routeMapper().routes
		expect(routes).toEqual({})
	})

	it("should add a post", function () {
		var callback = function () {}
		
		var routes = application.routeMapper()
			.post("url", callback)
			.routes

		var expectedRoutes = {
			"url" : {
				method: "POST",
				processRequest: callback
			}
		}

		expect(routes).toEqual(expectedRoutes)
	})

	it("should add a get", function () {
		var callback = function () {}
		
		var routes = application.routeMapper()
			.get("url", callback)
			.routes

		var expectedRoutes = {
			"url" : {
				method: "GET",
				processRequest: callback
			}
		}

		expect(routes).toEqual(expectedRoutes)
	})
})

var buildRequestStream = function (url, method, body) {
	return {
		url: url,
		method: method,
		read: function () { return body }
	}
}
