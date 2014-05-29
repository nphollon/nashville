describe("The information hider", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var dummy = helpers.dummy
  var infoHiderFactory = helpers.requireSource("server/game/info_hider")
  var events = helpers.requireSource("server/game/game_events")
  var dispatcher, infoHider

  beforeEach(function () {
    dispatcher = {}
  })

  /**
  state: { nextEventType, nextPlayerIndex, wager, score, status }
  response: { enableInput, wager, score, status }
  **/

  it("should wrap state in a list if there is one player", function (done) {
    var state = dummy()
    
    dispatcher.sendDispatch = function (data) {
      expect(data).toEqual([ state ])
      done()
    }

    infoHider = infoHiderFactory.build(dispatcher, 1)
    infoHider.sendDispatch(state, dummy())
  })

  it("should duplicate state if there are two players", function (done) {
    var state = dummy()

    dispatcher.sendDispatch = function (data) {
      expect(data).toEqual([ state, state ])
      done()
    }

    infoHider = infoHiderFactory.build(dispatcher, 2)
    infoHider.sendDispatch(state, dummy())
  })

  it("should send first player's decision to callback if it is their turn", function (done) {
    var state = { nextPlayerIndex: 0 }
    var decisions = [ { wager: 1 }, dummy() ]

    dispatcher.sendDispatch = function (data, callback) {
      callback(null, decisions)
    }

    var serverCallback = function (error, data) {
      expect(error).toBe(null)
      expect(data).toEqual(events.playerEvent(1))
      done()
    }

    infoHider = infoHiderFactory.build(dispatcher, 2)
    infoHider.sendDispatch(state, serverCallback)
  })

  it("should send second player's decision to callback if it is their turn", function (done) {
    var state = { nextPlayerIndex: 1 }
    var decisions = [ dummy(), { wager: 2 } ]

    dispatcher.sendDispatch = function (data, callback) {
      callback(null, decisions)
    }

    var serverCallback = function (error, data) {
      expect(error).toBe(null)
      expect(data).toEqual(events.playerEvent(2))
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
    infoHider.sendDispatch(dummy(), serverCallback)
  })
})