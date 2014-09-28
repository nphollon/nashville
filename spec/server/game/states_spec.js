describe("The state", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var stateFactory = helpers.requireSource("server/game/states")
  var events = helpers.requireSource("server/game/events")
  var dummy = helpers.dummy
  var expectIsFrozen = helpers.expectIsFrozen

  describe("default state", function () {
    it("has a default wager of 1", function () {
      var state = stateFactory.build(1)
      expect(state.wager).toBe(1)
    })

    it("has one score if there is one player", function () {
      var state = stateFactory.build(1)
      expect(state.scores).toEqual([0])
    })

    it("has two scores if there are two players", function () {
      var state = stateFactory.build(2)
      expect(state.scores).toEqual([0, 0])
    })

    it("expects first player to move", function () {
      var state = stateFactory.build(3)
      expect(state.nextPlayerIndex).toBe(0)
      expect(state.lastPlayerIndex).toBe(3)
      expect(state.nextEventType).toBe(events.playerType)
    })

    it("has a default status message", function () {
      var state = stateFactory.build(2)
      expect(state.status).toBe("Welcome to Nashville")
    })
  })

  describe("setting a wager", function () {
    it("sets the wager to the given value", function (done) {
      var startState = stateFactory.build(1)
      var wager = dummy()
      stateFactory.setWager(wager)(startState, function (error, endState) {
        expect(error).toBe(null)
        expect(endState.wager).toBe(wager)
        expectIsFrozen(endState)
        done()
      })
    })

    it("says who set the wager in the status message", function (done) {
      var startState = stateFactory.build(2, { nextPlayerIndex: 0 })
      stateFactory.setWager(2)(startState, function (error, endState) {
        expect(endState.status).toBe("Player 1 has bet $2")
        done()
      })
    })
  })

  describe("deciding an outcome", function () {
    it("awards the wager to first player if they won", function (done) {
      var wager = 5
      var startState = stateFactory.build(2, { wager: wager })
      stateFactory.win(0)(startState, function (error, endState) {
        expect(error).toBe(null)
        expect(endState.scores).toEqual([ wager, -wager ])
        expect(endState.winnerIndex).toBe(0)
        done()
      })
    })

    it("awards the wager to second player if they won", function (done) {
      var wager = 5
      var startState = stateFactory.build(2, { wager: wager })
      stateFactory.win(1)(startState, function (error, endState) {
        expect(endState.scores).toEqual([ -wager, wager ])
        expect(endState.winnerIndex).toBe(1)
        done()
      })
    })

    it("awards twice the wager to winner in three player game", function (done) {
      var wager = 2
      var startState = stateFactory.build(3, { wager: wager })
      stateFactory.win(0)(startState, function (error, endState) {
        expect(endState.scores).toEqual([ 2*wager, -wager, -wager ])
        done()
      })
    })

    it("declares the winner in the status message", function (done) {
      var startState = stateFactory.build(2)
      stateFactory.win(0)(startState, function (error, endState) {
        expect(endState.status).toBe("Player 1 has won")
        done()
      })
    })
  })

  describe("getting the next player", function () {
    var startState, playerCount

    beforeEach(function () {
      playerCount = 3
      startState = stateFactory.build(playerCount)
    })

    it("should be frozen", function (done) {
      stateFactory.nextPlayer(startState, function (error, endState) {
        expect(error).toBe(null)
        expectIsFrozen(endState)
        done()
      })
    })

    it("should expect the chance player second", function (done) {
      var startState = stateFactory.build(playerCount)
      stateFactory.nextPlayer(startState, function (error, endState) {
        expect(endState.nextPlayerIndex).toBe(playerCount)
        expect(endState.lastPlayerIndex).toBe(0)
        expect(endState.nextEventType).toBe(events.chanceType)
        done()
      })
    })

    it("should expect player 2 after the chance player", function (done) {
      var startState = stateFactory.build(playerCount, {
        nextPlayerIndex: playerCount,
        lastPlayerIndex: 0,
        nextEventType: events.chanceType
      })
      stateFactory.nextPlayer(startState, function (error, endState) {
        expect(endState.nextPlayerIndex).toBe(1)
        expect(endState.lastPlayerIndex).toBe(playerCount)
        expect(endState.nextEventType).toBe(events.playerType)
        done()
      })
    })

    it("should expect player 3 fifth", function (done) {
      var startState = stateFactory.build(playerCount, {
        nextPlayerIndex: playerCount,
        lastPlayerIndex: 1,
        nextEventType: events.chanceType
      })
      stateFactory.nextPlayer(startState, function (error, endState) {
        expect(endState.nextPlayerIndex).toBe(2)
        expect(endState.lastPlayerIndex).toBe(playerCount)
        expect(endState.nextEventType).toBe(events.playerType)
        done()
      })
    })

    it("should expect player 1 seventh", function (done) {
      var startState = stateFactory.build(playerCount, {
        nextPlayerIndex: playerCount,
        lastPlayerIndex: 2,
        nextEventType: events.chanceType
      })
      stateFactory.nextPlayer(startState, function (error, endState) {
        expect(endState.nextPlayerIndex).toBe(0)
        expect(endState.lastPlayerIndex).toBe(playerCount)
        expect(endState.nextEventType).toBe(events.playerType)
        done()
      })
    })
  })
})
