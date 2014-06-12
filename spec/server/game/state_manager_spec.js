"use strict";

describe("The state manager", function () {
  var helpers = require("../../spec_helper")
  var events = helpers.requireSource("server/game/events")
  var stateManagerFactory = helpers.requireSource("server/game/state_manager")
  var dummy = helpers.dummy

  var stateManager, initialState, expectedState

  var expectations = function (done) {
    return function (error, data) {
      expect(error).toBe(null)
      expect(data).toBe(expectedState)
      done()
    }
  }

  beforeEach(function () {
    stateManager = stateManagerFactory.build()
    expectedState = dummy()
  })

  it("should request chance event after client makes a wager", function (done) {
    var decision = events.playerEvent({ wager: 3 })

    initialState = {
      nextEventType: events.playerType,
      setWager: function (wager) { 
        return (wager === decision.wager) ? expectedState : undefined
      }
    }

    stateManager.advance(initialState, decision, expectations(done))
  })

  it("should award a win to the player who wins", function (done) {
    var decision = events.chanceEvent(true)

    var intermediateState = {
      nextPlayer: function () { return expectedState }
    }

    initialState = {
      nextEventType: events.chanceType,
      win: function (winnerIndex) {
        return (winnerIndex === decision.userWins) ? intermediateState : undefined
      }
    }

    stateManager.advance(initialState, decision, expectations(done))
  })

  it("should return error if an unexpected chance event is received", function (done) {
    var decision = events.chanceEvent(true)
    var initialState = {
      nextEventType: events.playerType
    }

    var callback = function (error) {
      expect(error.message).toBe("State manager received invalid decision.")
      expect(error.decision).toEqual(decision)
      expect(error.state).toEqual(initialState)
      done()
    }

    stateManager.advance(initialState, decision, callback)
  })

  it("should return error if an unexpected client event is received", function (done) {
    var decision = events.playerEvent({ wager: 3 })
    var initialState = {
      nextEventType: events.chanceType
    }

    var callback = function (error) {
      expect(error.message).toBe("State manager received invalid decision.")
      expect(error.decision).toEqual(decision)
      expect(error.state).toEqual(initialState)
      done()
    }

    stateManager.advance(initialState, decision, callback)    
  })
})