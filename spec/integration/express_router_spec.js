describe("Express router", function () {
  "use strict";

  var http = require("http")
  var request = require("request")
  var helpers = require("../spec_helper")
  var events = helpers.requireSource("server/game/events")
  var routerFactory = helpers.requireSource("server/web/express_router")

  var dispatcher, router, application

  var port = 3001
  var host = "http://localhost:" + port

  var jar = request.jar()
  var cookie = request.cookie("session=sessionID")
  jar.setCookie(cookie, host, function () {})


  beforeEach(function () {
    helpers.setSpecTimeout(5000)

    dispatcher = {}

    var sessionManager = {
      lookup: function (request) {
        if (request.cookies.session === "sessionID") {
          return dispatcher
        }
      }
    }

    router = routerFactory.build(sessionManager)
    
    application = http.createServer(router)
    application.listen(port)
  })

  afterEach(function () {
    application.close()
    helpers.resetSpecTimeout()
  })

  it("should serve homepage", function (done) {
    request.get(host, function (err, response, body) {
      expect(response.statusCode).toBe(200)
      expect(body).toMatch(/^<!DOCTYPE html>/)
      done()
    })
  })

  describe("requesting an update", function () {
    var url = host + "/request-update"

    it("should respond with update from the dispatcher", function (done) {
      var update = { state: "success" }

      dispatcher.requestUpdate = function (callback) {
        callback(null, update)
      }

      request.post(options(url), function (err, response, body) {
        expect(response.statusCode).toEqual(200)
        expect(body).toEqual(update)
        done()
      })
    })

    it("should respond with 422 if dispatcher sends an error", function (done) {
      var dispatcherError = { state: "failure" }

      dispatcher.requestUpdate = function (callback) {
        callback(dispatcherError)
      }

      request.post(options(url), function (err, response, body) {
        expect(response.statusCode).toEqual(422)
        expect(body).toEqual(dispatcherError)
        done()
      })      
    })
  })

  describe("submitting a decision", function () {
    var url = host + "/submit-decision"
    var decision = { wager: 5 }

    it("should send decision to dispatcher and receive update", function (done) {
      var update = { state: "success" }

      dispatcher.submitDecision = function (data, callback) {
        expect(data).toEqual(events.playerEvent(decision))
        callback(null, update)
      }

      request.post(options(url, decision), function (err, response, body) {
        expect(response.statusCode).toEqual(200)
        expect(body).toEqual(update)
        done()
      })
    })

    it("should respond with 422 if dispatcher sends an error", function (done) {
      var dispatcherError = { state: "failure" }

      dispatcher.submitDecision = function (data, callback) {
        callback(dispatcherError)
      }

      request.post(options(url, decision), function (err, response, body) {
        expect(response.statusCode).toEqual(422)
        expect(body).toEqual(dispatcherError)
        done()
      })      
    })
  })

  var options = function (url, decision) {
    var opt = {
      url: url,
      json: true,
      jar: jar
    }

    if (decision !== undefined) {
      opt.form = decision
    }

    return opt
  }
})