describe("The information hider", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var dummy = helpers.dummy
  var infoHiderFactory = helpers.requireSource("server/game/info_hider")
  var dispatcher, infoHider, state

  beforeEach(function () {
    dispatcher = {}

    var dummyResponse = [ dummy(), dummy() ]

    state = {
      toResponse: function (i) { return dummyResponse[i] }
    }
  })

  it("should wrap state in a list if there is one player", function (done) {    
    dispatcher.sendDispatch = function (data) {
      expect(data).toEqual([ state.toResponse(0) ])
      done()
    }

    infoHider = infoHiderFactory.build(dispatcher, 1)
    infoHider.sendDispatch(state, dummy())
  })

  it("should duplicate state if there are two players", function (done) {
    dispatcher.sendDispatch = function (data) {
      expect(data).toEqual([ state.toResponse(0), state.toResponse(1) ])
      done()
    }

    infoHider = infoHiderFactory.build(dispatcher, 2)
    infoHider.sendDispatch(state, dummy())
  })

  it("should send first player's decision to callback if it is their turn", function (done) {
    var decisions = [ dummy(), dummy() ]
    state.nextPlayerIndex = 0

    dispatcher.sendDispatch = function (data, callback) {
      callback(null, decisions)
    }

    var serverCallback = function (error, data) {
      expect(error).toBe(null)
      expect(data).toEqual(decisions[0])
      done()
    }

    infoHider = infoHiderFactory.build(dispatcher, 2)
    infoHider.sendDispatch(state, serverCallback)
  })

  it("should send second player's decision to callback if it is their turn", function (done) {
    var decisions = [ dummy(), dummy() ]
    state.nextPlayerIndex = 1

    dispatcher.sendDispatch = function (data, callback) {
      callback(null, decisions)
    }

    var serverCallback = function (error, data) {
      expect(error).toBe(null)
      expect(data).toEqual(decisions[1])
      done()
    }

    infoHider = infoHiderFactory.build(dispatcher, 2)
    infoHider.sendDispatch(state, serverCallback)
  })

  it("should forward dispatcher error to callback", function (done) {
    var dispatcherError = dummy()

    dispatcher.sendDispatch = function (data, callback) {
      callback(dispatcherError)
    }

    var serverCallback = function (error) {
      expect(error).toBe(dispatcherError)
      done()
    }

    infoHider = infoHiderFactory.build(dispatcher, 1)
    infoHider.sendDispatch(state, serverCallback)
  })

  it("should forward server error to dispatcher", function (done) {
    var serverError = dummy()

    dispatcher.sendError = function (error) {
      expect(error).toBe(serverError)
      done()
    }

    infoHider = infoHiderFactory.build(dispatcher, 1)
    infoHider.sendError(serverError)
  })
})