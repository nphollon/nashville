describe("The information hider", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var dummy = helpers.dummy
  var infoHiderFactory = helpers.requireSource("server/game/info_hider")
  var dispatcher, infoHider, state, toResponse, dummyResponse

  beforeEach(function () {
    dispatcher = {}

    state = dummy()
    dummyResponse = [ dummy(), dummy() ]

    toResponse = function (receivedState, playerIndex, callback) {
      if (receivedState === state) {
        callback(dummyResponse[playerIndex])
      }
    }

  })

  it("should wrap state in a list if there is one player", function (done) {    
    dispatcher.sendDispatch = function (data) {
      expect(data).toEqual([ dummyResponse[0] ])
      done()
    }

    infoHider = infoHiderFactory.build(dispatcher, toResponse, 1)
    infoHider.sendDispatch(state, dummy())
  })

  it("should duplicate state if there are two players", function (done) {
    dispatcher.sendDispatch = function (data) {
      expect(data).toEqual([ dummyResponse[0], dummyResponse[1] ])
      done()
    }

    infoHider = infoHiderFactory.build(dispatcher, toResponse, 2)
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

    infoHider = infoHiderFactory.build(dispatcher, toResponse, 2)
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

    infoHider = infoHiderFactory.build(dispatcher, toResponse, 2)
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

    infoHider = infoHiderFactory.build(dispatcher, toResponse, 1)
    infoHider.sendDispatch(state, serverCallback)
  })

  it("should forward server error to dispatcher", function (done) {
    var serverError = dummy()

    dispatcher.sendError = function (error) {
      expect(error).toBe(serverError)
      done()
    }

    infoHider = infoHiderFactory.build(dispatcher, toResponse, 1)
    infoHider.sendError(serverError)
  })
})