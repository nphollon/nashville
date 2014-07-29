describe("The chance player", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var chancePlayer = helpers.requireSource("server/game/chance_player")
  var events = helpers.requireSource("server/game/events")

  var state, random, decide

  beforeEach(function () {
    random = {}
    decide = chancePlayer.decider(random)
    state = { scores: new Array(3) }
  })

  describe ("getting the next event", function () {
    it("should select a winner randomly from the list of players", function (done) {
      random.integer = jasmine.createSpy("integer")

      decide(state, function () {
        expect(random.integer).toHaveBeenCalledWith(0, 2)
        done()
      })
    })

    it("should return the index of the winning player", function (done) {
      random.integer = function () { return 1 }

      decide(state, function (decision) {
        expect(decision).toEqual(events.chanceEvent(1))
        done()
      }) 
    })
  })
})