describe("Default opponent", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var opponentFactory = helpers.requireSource("server/game/opponent")
  var dummy = helpers.dummy
  var opponent

  describe("starting", function () {
    it("requests an update", function (done) {
      var inputCallbacks = {
        requestUpdate: function (callback) {
          expect(callback).toBe(opponent.getNextEvent)
          done()
        },
        submitDecision: dummy()
      }

      opponent = opponentFactory.build(inputCallbacks)
      opponent.start()
    })
  })

  describe("getting the next event", function () {
    it("returns a wager of 1", function (done) {
      var expectedDecision = { wager: 1 }

      var inputCallbacks = {
        requestUpdate: dummy(),
        submitDecision: function (decision, callback) {
          expect(decision).toEqual(expectedDecision)
          expect(callback).toBe(opponent.getNextEvent)
          done()
        }
      }

      opponent = opponentFactory.build(inputCallbacks)
      opponent.getNextEvent(null, null)
    })
  })
})