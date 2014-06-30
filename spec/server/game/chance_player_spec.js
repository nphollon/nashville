describe("The chance player", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var chancePlayerFactory = helpers.requireSource("server/game/chance_player")
  var events = helpers.requireSource("server/game/events")

  var state, random, chancePlayer, inputCallbacks

  beforeEach(function () {
    random = {}
    inputCallbacks = {}
    chancePlayer = chancePlayerFactory.build(random, inputCallbacks)
    state = { scores: new Array(3) }
  })

  describe("starting", function () {
    it("requests an update", function (done) {
      inputCallbacks.requestUpdate = function (callback) {
        expect(callback).toBe(chancePlayer.getNextEvent)
        done()
      }

      chancePlayer.start()
    })
  })

  describe ("getting the next event", function () {
    it("should select a winner randomly from the list of players", function (done) {
      random.integer = jasmine.createSpy("integer")

      inputCallbacks.submitDecision = function () {
        expect(random.integer).toHaveBeenCalledWith(0, 2)
        done()
      }

      chancePlayer.getNextEvent(null, state)
    })

    it("should return the index of the winning player", function (done) {
      random.integer = function () { return 1 }

      inputCallbacks.submitDecision = function (data, callback) {
        expect(data).toEqual(events.chanceEvent(1))
        expect(callback).toBe(chancePlayer.getNextEvent)
        done()
      } 

      chancePlayer.getNextEvent(null, state)
    })

    it("should give up if it receives an error", function (done) {
      inputCallbacks.submitDecision = jasmine.createSpy("submit decision")
      chancePlayer.getNextEvent(new Error("dispatcher error"))

      helpers.later(function () {
        expect(inputCallbacks.submitDecision).not.toHaveBeenCalled()
        done()
      })
    })
  })
})