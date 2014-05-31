describe("The chance player", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var chancePlayerFactory = helpers.requireSource("server/game/chance_player")
  var events = helpers.requireSource("server/game/events")

  it("should decide the user wins if RNG returns true", function (done) {
    var random = {
      bool: function () { return true }
    }

    var chancePlayer = chancePlayerFactory.build(random)

    chancePlayer.getNextEvent(null, function (error, decision) {
      expect(error).toBe(null)
      expect(decision).toEqual(events.chanceEvent(true))
      done()
    })
  })

  it("should decide the user loses if RNG returns false", function (done) {
    var random = {
      bool: function () { return false }
    }

    var chancePlayer = chancePlayerFactory.build(random)

    chancePlayer.getNextEvent(null, function (error, decision) {
      expect(error).toBe(null)
      expect(decision).toEqual(events.chanceEvent(false))
      done()
    })
  })
})