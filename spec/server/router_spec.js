describe("The router", function () {
  "use strict";

  var helpers = require("../spec_helper")
  var mock = helpers.mock
  var dummy = helpers.dummy
  var checkArgumentAndForward = helpers.checkArgumentAndForward
  var requireSource = helpers.requireSource

  var routerFactory = requireSource("server/router")

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

    router = routerFactory.build(routes)
    responseStream = mock(["writeHead", "end"])
  })

  afterEach(function () {
    expect(responseStream.writeHead.calls.count()).toBe(1)
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

  it("should return 422 if route sends error to callback", function (done) {    
    var requestStream = buildRequestStream(postUrl, POST, dummy())
    var error = new Error("test error")

    var responseType = "application/json"
    routes[postUrl].processRequest = function (requestBody, responseCallback) {
      process.nextTick(function () {
        responseCallback(error)

        process.nextTick(function () {
          expect(responseStream.writeHead).toHaveBeenCalledWith(422, { "Content-Type": responseType })
          expect(responseStream.end).toHaveBeenCalledWith(error)
          done()
        })
      })
    }

    routes[postUrl].responseType = responseType

    router.respond(requestStream, responseStream)

  })

  var buildRequestStream = function (url, method, body) {
    return {
      url: url,
      method: method,
      read: function () { return body }
    }
  }
})
