describe("Default opponent", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var opponents = helpers.requireSource("server/game/default_opponent")
  var events = helpers.requireSource("server/game/events")

  it("should place a wager of $1", function (done) {
    var expectedDecision = events.playerEvent({ wager: 1 })
    var decide = opponents.defaultDecider()

    decide(null, function (decision) {
      expect(decision).toEqual(expectedDecision)
      done()
    })
  })
})