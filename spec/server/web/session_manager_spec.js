describe("Session manager", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var sessionManagerFactory = helpers.requireSource("server/web/session_manager")
  var dummy = helpers.dummy

  var sessionId, gameId, sessionManager

  var dummyRequest = { cookies: {} }
  var dummyResponse = { cookie: dummy() }


  var random = {
    uuid4: function () {
      sessionId += 1
      return session(sessionId)
    }
  }

  var session = function (id) {
    return "session" + id
  }

  var splitterInput = function (id) {
    return { id: id }
  }

  var nextGame = function () {
    gameId += 1
    var returnValue = splitterInput(gameId)

    return { 
      splitter: {
        input: function (n) {
          if (n === 0) {
            return returnValue
          }
        }
      }
    }
  }

  beforeEach(function () {
    sessionId = 0
    gameId = 0
    sessionManager = sessionManagerFactory.build(random, nextGame)
  })

  it("should return a new game if session cookie is missing from the request", function () {
    expect(sessionManager.lookup(dummyRequest, dummyResponse)).toEqual(splitterInput(1))
    expect(sessionManager.lookup(dummyRequest, dummyResponse)).toEqual(splitterInput(2))
  })

  it("should return a new game if session cookie on request is invalid", function () {
    var request = {
      cookies: {
        session: session(2)
      }
    }

    expect(sessionManager.lookup(request, dummyResponse)).toEqual(splitterInput(1))
  })

  it("should set a cookie on the response if a new game is created", function (done) {
    var response = {
      cookie: function (name, value) {
        expect(name).toBe("session")
        expect(value).toBe(session(1))
        done()
      }
    }

    sessionManager.lookup(dummyRequest, response)
  })

  it("should set a unique session cookie on each response", function (done) {
    var response = {
      cookie: function (name, value) {
        expect(name).toBe("session")
        expect(value).toBe(session(2))
        done()
      }
    }

    sessionManager.lookup(dummyRequest, dummyResponse)
    sessionManager.lookup(dummyRequest, response)
  })

  it("should return the game corresponding to the session cookie on the request", function () {
    var request = {
      cookies: {
        session: session(2)
      }
    }

    sessionManager.lookup(dummyRequest, dummyResponse)
    sessionManager.lookup(dummyRequest, dummyResponse)
    sessionManager.lookup(dummyRequest, dummyResponse)

    expect(sessionManager.lookup(request, dummyResponse)).toEqual(splitterInput(2))
  })
})