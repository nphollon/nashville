describe("Ajax adapter", function () {
  "use strict";

  var helpers = require("../spec_helper")
  var dummy = helpers.dummy
  var adapterFactory = helpers.requireSource("server/ajax_adapter")
  var events = helpers.requireSource("server/game_events")
  var adapter, dispatcher

  beforeEach(function () {
    dispatcher = dummy()
    adapter = adapterFactory.build(dispatcher)
  })

  it("should stringify dispatcher responses when client requests update", function (done) {
    var gameState = {
      nextEventType: events.playerType,
      wager: 1,
      score: 0,
      status: ""
    }

    var serverResponse = {
      enableInput: true,
      wager: 1,
      score: 0,
      status: ""
    }

    var clientCallback = function (error, data) {
      expect(error).toBe(null)
      expect(data).toBe(JSON.stringify(serverResponse))
      done()
    }

    dispatcher.requestUpdate = function (callback) {
      callback(null, gameState)
    }

    adapter.requestUpdate("{}", clientCallback)
  })

  it("should transform decisions to player events and send to dispatcher", function (done) {
    var clientCallback = dummy()
    var jsonDecision = JSON.stringify({ wager: 3 })

    dispatcher.submitDecision = function (playerEvent) {
      expect(playerEvent.wager).toBe(3)
      expect(playerEvent.type).toBe(events.playerType)
      done()
    }

    adapter.submitDecision(jsonDecision, clientCallback)
  })

  it("should stringify dispatcher responses when client submits decision", function (done) {
    var gameState = {
      nextEventType: events.playerType,
      wager: 1,
      score: 0,
      status: ""
    }

    var serverResponse = {
      enableInput: true,
      wager: 1,
      score: 0,
      status: ""
    }

    var clientCallback = function (error, data) {
      expect(error).toBe(null)
      expect(data).toBe(JSON.stringify(serverResponse))
      done()
    }

    dispatcher.submitDecision = function (playerEvent, callback) {
      callback(null, gameState)
    }

    adapter.submitDecision("{}", clientCallback)
  })
})