"use strict";

describe("The state manager", function () {
  var helpers = require("../../spec_helper")
  var events = helpers.requireSource("server/game/events")
  var stateManagerFactory = helpers.requireSource("server/game/state_manager")
  var dummy = helpers.dummy()

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

  it("should award a loss if chance event is false", function (done) {
    var decision = events.chanceEvent(false)

    initialState = {
      nextEventType: events.chanceType,
      lose: function () {
        return expectedState
      }
    }

    stateManager.advance(initialState, decision, expectations(done))
  })

  it("should add wager to score if chance event is true", function (done) {
    var decision = events.chanceEvent(true)

    initialState = {
      nextEventType: events.chanceType,
      win: function () {
        return expectedState
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