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
  jar.setCookie(cookie, host)


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

  /*
  - Does the client have a valid session cookie?
  - Find the game corresponding to session cookie X
  - Create a new game and session cookie
  */
  /**
  Background
  Given the game always awards victory to me


  Given I have no cookies in my browser

  When I request an update from the server
  Then I should receive a game in its initial state
  And I should receive a session cookie

  When I submit a wager of 2
  Then I should receive a game state with scores 2:-2

  When I request an update
  Then I should receive a game state with scores 2:-2

  When I clear my cookies
  And I request an update
  Then I should receive a game in its initial state
  And I should receive a session cookie

  When I submit a wager of 1
  And I clear my cookies
  And I submit a wager of 2
  Then I should receive a game state with scores 2:-2

  When I clear my cookies
  And I create an invalid session cookie
  And I request an update
  Then I should receive a game in its initial state

  ---------------------------------------
  Background
  Given the game always awards victory to me
  And when creating a new session cookie, the server creates cookie AA, followed by cookie BB


  Given I have no cookies in my browser

  When I request an update from the server
  Then I should receive session cookie AA

  When I submit a wager of 1
  Then I should receive a game state with scores 1:-1

  When I clear my cookies
  And I request an update
  Then I should receive session cookie BB

  When I replace cookie BB with cookie AA
  And I request an update
  Then I should receive a game state with scores 1:-1

  When I replace cookie AA with cookie BB
  And I submit a wager of 3
  Then I should receive a game state with scores 3:-3
  **/
})