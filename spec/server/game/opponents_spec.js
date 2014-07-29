describe("Opponents", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var opponents = helpers.requireSource("server/game/opponents")
  var events = helpers.requireSource("server/game/events")

  describe("default opponent", function () {
    it("should place a wager of 1", function (done) {
      var decide = opponents.defaultDecider()

      decide(null, verifyWager(1, done))
    })
  })

  describe("Martingale opponent", function () {
    it("should bet 1 if it hasn't bet yet", function (done) {
      var decide = opponents.martingaleDecider()

      decide(stateWithScore(0), verifyWager(1, done))
    })

    it("should bet 2 if its last score was 1 and its current score is 0", function (done) {
      var decide = opponents.martingaleDecider()
      decide(stateWithScore(1), function () {
        decide(stateWithScore(0), verifyWager(2, done))
      })
    })

    it("should bet 1 if its last score was 0 and its current score is 1", function (done) {
      var decide = opponents.martingaleDecider()
      decide(stateWithScore(0), function () {
        decide(stateWithScore(1), verifyWager(1, done))
      })
    })
  })

  var stateWithScore = function (score) {
    return {
      playerIndex: 1,
      scores: [0, score, 0]
    }
  }

  var verifyWager = function (amount, done) {
    return function (decision) {
      expect(decision).toEqual(events.playerEvent({ wager: amount }))
      done()
    }
  }
})