describe("Default opponent", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var opponentFactory = helpers.requireSource("server/game/opponent")
  var events = helpers.requireSource("server/game/events")

  var opponent, inputCallbacks

  beforeEach(function () {
    inputCallbacks = {}
    opponent = opponentFactory.build(inputCallbacks)
  })

  describe("starting", function () {
    it("requests an update", function (done) {
      inputCallbacks.requestUpdate = function (callback) {
        expect(callback).toBe(opponent.getNextEvent)
        done()
      }

      opponent.start()
    })
  })

  describe("getting the next event", function () {
    it("returns a wager of 1", function (done) {
      var expectedDecision = events.playerEvent({ wager: 1 })

      inputCallbacks.submitDecision = function (decision, callback) {
        expect(decision).toEqual(expectedDecision)
        expect(callback).toBe(opponent.getNextEvent)
        done()
      }

      opponent.getNextEvent(null, null)
    })
  })
})