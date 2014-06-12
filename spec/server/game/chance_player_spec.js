describe("The chance player", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var chancePlayerFactory = helpers.requireSource("server/game/chance_player")
  var events = helpers.requireSource("server/game/events")

  var state, random, chancePlayer

  beforeEach(function () {
    random = {}
    chancePlayer = chancePlayerFactory.build(random)
    state = { scores: new Array(3) }
  })

  it("should select a winner randomly from the list of players", function (done) {
    random.integer = jasmine.createSpy("integer")

    chancePlayer.getNextEvent(state, function () {
      expect(random.integer).toHaveBeenCalledWith(0, 2)
      done()
    })
  })

  it("should return the index of the winning player", function (done) {
    random.integer = function () { return 1 }

    chancePlayer.getNextEvent(state, function (error, decision) {
      expect(error).toBe(null)
      expect(decision).toEqual(events.chanceEvent(1))
      done()
    })
  })
})