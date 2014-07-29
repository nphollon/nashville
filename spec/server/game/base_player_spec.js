describe("Player prototype", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var playerFactory = helpers.requireSource("server/game/base_player")

  var player, inputCallbacks

  beforeEach(function () {
    inputCallbacks = {}
    player = playerFactory.build(inputCallbacks)
  })

  describe("starting", function () {
    it("requests an update", function (done) {
      inputCallbacks.requestUpdate = function (callback) {
        expect(callback).toBe(player.getNextEvent)
        done()
      }

      player.start()
    })
  })

  describe("getting the next event", function () {
    it("gives up if an error is received", function (done) {
      inputCallbacks.submitDecision = jasmine.createSpy("submit decision")

      player.getNextEvent(new Error("dispatcher error"))

      helpers.later(function () {
        expect(inputCallbacks.submitDecision).not.toHaveBeenCalled()
        done()
      })
    })
  })
})