describe("Player prototype", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var playerFactory = helpers.requireSource("server/game/base_player")
  var dummy = helpers.dummy
  var later = helpers.later

  it("passes game state to decision function", function (done) {
    var state = dummy()

    var inputCallbacks = {
      requestUpdate: function (callback) {
        callback(null, state)
      }
    }

    var decider = function (data) {
      expect(data).toBe(state)
      done()
    }

    buildAndStartPlayer(inputCallbacks, decider)
  })

  it("passes decision to submit function", function (done) {
    var decision = dummy()
    var eventHandler

    var inputCallbacks = {
      requestUpdate: function (callback) {
        eventHandler = callback
        callback(null, dummy())
      },

      submitDecision: function (data, callback) {
        expect(callback).toBe(eventHandler)
        expect(data).toBe(decision)
        done()
      }
    }

    var decider = function (data, callback) {
      callback(decision)
    }

    buildAndStartPlayer(inputCallbacks, decider)
  })

  it("gives up if an error is received", function (done) {
    var inputCallbacks = {
      requestUpdate: function (callback) {
        callback(new Error("dispatcher error"))
      }
    }

    var decider = jasmine.createSpy("decider")

    buildAndStartPlayer(inputCallbacks, decider)

    later(function () {
      expect(decider).not.toHaveBeenCalled()
      done()
    })
  })

  it("does nothing if not given a decision function", function (done) {
    var inputCallbacks = {
      requestUpdate: jasmine.createSpy("requestUpdate")
    }

    buildAndStartPlayer(inputCallbacks, null)

    later(function () {
      expect(inputCallbacks.requestUpdate).not.toHaveBeenCalled()
      done()
    })
  })

  var buildAndStartPlayer = function (inputCallbacks, decider) {
    var player = playerFactory.build(inputCallbacks, decider)
    player.start()    
  }
})