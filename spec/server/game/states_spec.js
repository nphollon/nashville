describe("The state", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var stateFactory = helpers.requireSource("server/game/states")
  var events = helpers.requireSource("server/game/events")
  var dummy = helpers.dummy

  var expectIsFrozen = function (object) {
    expect(Object.isFrozen(object)).toBe(true)
  }

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
  })

  it("allows a wager to be set", function () {
    var startState = stateFactory.build(1)
    var wager = dummy()
    var endState = startState.setWager(wager)
    expect(endState.wager).toBe(wager)
    expectIsFrozen(endState)
  })

  describe("deciding an outcome", function () {
    it("awards the wager to first player if they won", function () {
      var startState = stateFactory.build(2)
      var wager = 5
      var endState = startState.setWager(wager).win(0)
      expect(endState.scores).toEqual([ 5, -5 ])
      expect(endState.winnerIndex).toBe(0)
    })

    it("awards the wager to second player if they won", function() {
      var startState = stateFactory.build(2)
      var wager = 5
      var endState = startState.setWager(wager).win(1)
      expect(endState.scores).toEqual([ -5, 5 ])
      expect(endState.winnerIndex).toBe(1)
    })

    it("awards twice the wager to winner in three player game", function () {
      var startState = stateFactory.build(3)
      var wager = 2
      var endState = startState.setWager(wager).win(0)
      expect(endState.scores).toEqual([ 4, -2, -2 ])
    })
  })

  describe("getting the next player", function () {
    var startState, playerCount

    beforeEach(function () {
      playerCount = 3
      startState = stateFactory.build(playerCount)
    })

    it("should be frozen", function () {
      expectIsFrozen(startState.nextPlayer())
    })

    it("expects first player to move", function () {
      var state = stateFactory.build(1)
      expect(state.nextPlayerIndex).toBe(0)
      expect(state.nextEventType).toBe(events.playerType)
    })

    it("should expect the chance player second", function () {
      var endState = startState.nextPlayer()
      expect(endState.nextPlayerIndex).toBe(playerCount)
      expect(endState.nextEventType).toBe(events.chanceType)
    })

    it("should expect player 2 after the chance player", function () {
      var endState = startState.nextPlayer().nextPlayer()
      expect(endState.nextPlayerIndex).toBe(1)
      expect(endState.nextEventType).toBe(events.playerType)
    })

    it("should expect player 3 fifth", function () {
      var endState = startState
        .nextPlayer().nextPlayer() // player 2
        .nextPlayer().nextPlayer() // player 3
      expect(endState.nextPlayerIndex).toBe(2)
      expect(endState.nextEventType).toBe(events.playerType)
    })

    it("should expect player 1 seventh", function () {
      var endState = startState
        .nextPlayer().nextPlayer() // player 2
        .nextPlayer().nextPlayer() // player 3
        .nextPlayer().nextPlayer() // player 1
      expect(endState.nextPlayerIndex).toBe(0)
      expect(endState.nextEventType).toBe(events.playerType)
    })
  })

  describe("The response", function () {
    it("should be immutable", function () {
      var state = stateFactory.build(1)
      var response = state.toResponse(0)
      expectIsFrozen(response)
    })

    it("should not contain the next event type or player index", function () {
      var state = stateFactory.build(1)
      expect(state.hasOwnProperty("nextEventType")).toBe(true)
      expect(state.hasOwnProperty("nextPlayerIndex")).toBe(true)
      var response = state.toResponse(0)
      expect(response.hasOwnProperty("nextEventType")).toBe(false)
      expect(response.hasOwnProperty("nextPlayerIndex")).toBe(false)
    })

    it("should contain the same wager", function () {
      var expectedWager = dummy()
      var state = stateFactory.build(2, { wager: expectedWager })
      var response = state.toResponse(0)
      expect(response.wager).toEqual(expectedWager)
    })

    it("should contain the same list of scores", function () {
      var expectedScores = [ dummy(), dummy() ]
      var state = stateFactory.build(2, { scores: expectedScores })
      var response = state.toResponse(0)
      expect(response.scores).toEqual(expectedScores)
    })

    it("should contain index 0 if the response is for player 0", function () {
      var response = stateFactory.build(2).toResponse(0)
      expect(response.playerIndex).toEqual(0)
    })

    it("should contain index 1 if the response is for player 1", function () {
      var response = stateFactory.build(2).toResponse(1)
      expect(response.playerIndex).toEqual(1)
    })

    describe("status message", function () {
      it("should contain lose message if player lost", function () {
        var state = stateFactory.build(2, { winnerIndex: 1 })
        var response = state.toResponse(0)
        expect(response.status).toEqual("You lost.")
      })

      it("should contain win message if player won", function () {
        var state = stateFactory.build(2, { winnerIndex: 0 })
        var response = state.toResponse(0)
        expect(response.status).toEqual("You won.")
      })

      it("should contain instruction if nobody has won yet", function () {
        var state = stateFactory.build(2, { winnerIndex: undefined })
        var response = state.toResponse(0)
        expect(response.status).toEqual("Place your bet.")
      })
    })

    describe("enabling player input", function () {
      it("should enable input for first player if it is their turn", function () {
        var state = stateFactory.build(2, { nextPlayerIndex: 0 })
        var response = state.toResponse(0)
        expect(response.enableInput).toBe(true)
      })

      it("should disable input for first player if it is not their turn", function () {
        var state = stateFactory.build(2, { nextPlayerIndex: 1 })
        var response = state.toResponse(0)
        expect(response.enableInput).toBe(false)
      })

      it("should enable input for second player if it is their turn", function () {
        var state = stateFactory.build(2, { nextPlayerIndex: 1 })
        var response = state.toResponse(1)
        expect(response.enableInput).toBe(true)
      })

      it("should not enable input for any player if a chance event is expected", function () {
        var state = stateFactory.build(1, { nextPlayerIndex: 0, nextEventType: events.chanceType })
        var response = state.toResponse(0)
        expect(response.enableInput).toBe(false)
      })
    })
  })
})