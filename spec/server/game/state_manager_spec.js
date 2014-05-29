"use strict";

describe("The state manager", function () {
  var helpers = require("../../spec_helper")
  var events = helpers.requireSource("server/game/game_events")
  var stateManagerFactory = helpers.requireSource("server/game/state_manager")
  var stateManager

  beforeEach(function () {
    stateManager = stateManagerFactory.build()
  })

  it("should initialize the game state", function (done) {
    var callback = function (error, data) {
      expect(error).toBe(null)
      expect(data).toEqual(stateManagerFactory.createState())
      done()
    }

    stateManager.initialize(callback)
  })

  it("should request chance event after client makes a wager", function (done) {
    var decision = events.playerEvent({ wager: 3 })
    var initialState = { nextEventType: events.playerType, wager: 1, score: 0, status: "" }

    var callback = function (error, data) {
      expect(error).toBe(null)
      expect(data.nextEventType).toBe(events.chanceType)
      expect(data.wager).toBe(3)
      expect(data.score).toBe(0)
      done()
    }

    stateManager.advance(initialState, decision, callback)
  })

  it("should deduct wager from score if chance event is false", function (done) {
    var decision = events.chanceEvent(false)
    var initialState = { nextEventType: events.chanceType, wager: 3, score: 5, status: "" }

    var callback = function (error, data) {
      expect(error).toBe(null)
      expect(data.nextEventType).toBe(events.playerType)
      expect(data.wager).toBe(3)
      expect(data.score).toBe(2)
      expect(data.status).toBe("You lost.")
      done()
    }

    stateManager.advance(initialState, decision, callback)
  })

  it("should add wager to score if chance event is true", function (done) {
    var decision = events.chanceEvent(true)
    var initialState = { nextEventType: events.chanceType, wager: 3, score: 5, status: "" }

    var callback = function (error, data) {
      expect(error).toBe(null)
      expect(data.nextEventType).toBe(events.playerType)
      expect(data.wager).toBe(3)
      expect(data.score).toBe(8)
      expect(data.status).toBe("You won.")
      done()
    }

    stateManager.advance(initialState, decision, callback)
  })

  it("should return error if an unexpected chance event is received", function (done) {
    var decision = events.chanceEvent(true)
    var initialState = { nextEventType: events.playerType, wager: 3, score: 5, status: "" }

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
    var initialState = { nextEventType: events.chanceType, wager: 3, score: 5, status: "" }

    var callback = function (error) {
      expect(error.message).toBe("State manager received invalid decision.")
      expect(error.decision).toEqual(decision)
      expect(error.state).toEqual(initialState)
      done()
    }

    stateManager.advance(initialState, decision, callback)    
  })
})