"use strict";

describe("The state manager", function () {
  var helpers = require("../../spec_helper")
  var events = helpers.requireSource("server/game/events")
  var states = helpers.requireSource("server/game/states")
  var stateManagerFactory = helpers.requireSource("server/game/state_manager")
  var dummy = helpers.dummy

  var stateManager, initialState, expectedState, intermediateState, dispatcher

  beforeEach(function () {
    dispatcher = {}

    stateManager = stateManagerFactory.build(dispatcher)
    
    expectedState = dummy()

    intermediateState = {
      nextPlayer: function () { return expectedState }
    }
  })

  describe("starting", function () {
    it("should initialize game state", function (done) {
      var expectedPlayerCount = 3
      spyOn(states, "build").and.callFake(function (playerCount) {
        return (playerCount === expectedPlayerCount) ? expectedState : undefined
      })

      stateManager.getNextEvent = function (error, data) {
        expect(error).toBe(null)
        expect(data).toBe(expectedState)
        done()
      }
      
      stateManager.start(expectedPlayerCount)
    })
  })

  it("should send the state to the dispatcher", function (done) {
    dispatcher.sendDispatch = function (dispatch) {
      expect(dispatch).toBe(expectedState)
      done()
    }

    stateManager.getNextEvent(null, expectedState)
  })

  it("should use the dispatcher's decision to advance the game state", function (done) {
    var expectedDecision = dummy()
    
    dispatcher.sendDispatch = function (dispatch, callback) {
      callback(null, expectedDecision)
    }

    stateManager.advance = function (state, decision, callback) {
      expect(state).toBe(expectedState)
      expect(decision).toBe(expectedDecision)
      expect(callback).toBe(stateManager.getNextEvent)
      done()
    }

    stateManager.getNextEvent(null, expectedState)
  })

  it("should request chance event after client makes a wager", function (done) {
    var decision = events.playerEvent({ wager: 3 })

    initialState = {
      nextEventType: events.playerType,
      setWager: function (wager) { 
        return (wager === decision.wager) ? intermediateState : undefined
      }
    }

    stateManager.advance(initialState, decision, function (error, data) {
      expect(error).toBe(null)
      expect(data).toBe(expectedState)
      done()
    })
  })

  it("should award a win to the player who wins", function (done) {
    var decision = events.chanceEvent(true)

    initialState = {
      nextEventType: events.chanceType,
      win: function (winnerIndex) {
        return (winnerIndex === decision.userWins) ? intermediateState : undefined
      }
    }

    stateManager.advance(initialState, decision, function (error, data) {
      expect(error).toBe(null)
      expect(data).toBe(expectedState)
      done()
    })
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