"use strict"

var http, application, mock, dummy

;(function () {
	http = require("http")
	application = require("../app/application")

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

		beforeEach(function () {
			routes = {
				"/validget": { method: "GET" },
				"/validpost": { method: "POST" }
			}
			router = application.buildRouter(routes)
			responseStream = mock(["writeHead", "end"])
		})

		afterEach(function () {
			expect(responseStream.writeHead.callCount).toBe(1)
			expect(responseStream.end).toHaveBeenCalled()
		})

		it("should return a 404 if the request url is invalid", function () {
			var requestStream = { url: "/invalid", method: "GET" }
			router.respond(requestStream, responseStream)
			expect(responseStream.writeHead).toHaveBeenCalledWith(404)
		})

		it("should return a 405 if the request is a POST and the route accepts a GET", function () {
			var requestStream = { url: "/validget", method: "POST" }
			router.respond(requestStream, responseStream)
			expect(responseStream.writeHead).toHaveBeenCalledWith(405)
		})

		it("should return a 405 if the request is a GET and the route accepts a POST", function () {
			var requestStream = { url: "/validpost", method: "GET" }
			router.respond(requestStream, responseStream)
			expect(responseStream.writeHead).toHaveBeenCalledWith(405)
		})
	})
})

/*
startServer(port, routes)
	requestCallback = startRequestCallback(routes)
	return http.createServer().listen(port)

startRequestCallback(routes)
	return function(request, response)
		path = getPath(request)
		requestBody = getRequestBody(request)
		route = routes[path]

		if (route)
			startResponse = route[getMethod(request)]
			if (startResponse)
				writeHeader(response, route.responseType)
				schedule(responsestarter(requestBody, function(responseBody)
					response.end(responseBody)
				))
			else
				methodNotAllowed(response)
		else
			pageNotFound(response)
*/