describe("The router", function () {
  "use strict";

  var helpers = require("../spec_helper")
  var mock = jasmine.createSpyObj
  var dummy = helpers.dummy
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
    responseStream = mock("response stream", ["writeHead", "end"])
  })

  afterEach(function () {
    expect(responseStream.writeHead.calls.count()).toBe(1)
    expect(responseStream.end).toHaveBeenCalled()
  })

  it("should return a 404 if the request url is invalid", function (done) {
    var requestStream = buildRequestStream(badUrl, GET)
    router(requestStream, responseStream)
    process.nextTick(function () {
      expect(responseStream.writeHead).toHaveBeenCalledWith(404)
      done()
    })
  })

  it("should return a 405 if the request is a POST and the route accepts a GET", function (done) {
    var requestStream = buildRequestStream(getUrl, POST)
    router(requestStream, responseStream)
    process.nextTick(function () {
      expect(responseStream.writeHead).toHaveBeenCalledWith(405)
      done()
    })
  })

  it("should return a 405 if the request is a GET and the route accepts a POST", function (done) {
    var requestStream = buildRequestStream(postUrl, GET)
    router(requestStream, responseStream)
    process.nextTick(function () {
      expect(responseStream.writeHead).toHaveBeenCalledWith(405)
      done()
    })
  })

  it("should delegate request processing to correct route", function (done) {
    var requestBody = "dummy"
    var responseBody = dummy()
    var responseType = "text/plain"
    var requestStream = buildRequestStream(postUrl, POST, requestBody)

    routes[postUrl].responseType = responseType

    routes[postUrl].processRequest =  function (argument, callback) {
      expect(argument).toBe(requestBody)

      process.nextTick(function () {
        callback(null, responseBody)

        process.nextTick(function () {
          expect(responseStream.writeHead).toHaveBeenCalledWith(200, { "Content-Type": responseType })
          expect(responseStream.end).toHaveBeenCalledWith(responseBody)
          done()
        })
      })
    }

    router(requestStream, responseStream)
  })

  it("should return 422 if route sends error to callback", function (done) {    
    var requestStream = buildRequestStream(postUrl, POST, dummy())
    var error = "test error"

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

    router(requestStream, responseStream)

  })

  var buildRequestStream = function (url, method, body) {
    var argMap = {
      "data": body,
      "end": undefined
    }

    return {
      url: url,
      method: method,
      setEncoding: dummy(),
      read: function () { return body },
      on: function (eventType, callback) {
        callback(argMap[eventType])
      }
    }
  }
})
