"use strict";

describe("The state manager", function () {
  var helpers = require("./spec_helper")
  var stateManagerFactory = helpers.requireSource("server/state_manager")
  var stateManager

  beforeEach(function () {
    stateManager = stateManagerFactory.build()
  })

  it("should initialize the game state", function (done) {
    var callback = function (error, data) {
      expect(error).toBe(null)
      expect(data.needChanceEvent).toBe(false)
      expect(data.wager).toBe(1)
      expect(data.score).toBe(0)
      done()
    }

    stateManager.initialize(callback)
  })

  it("should request chance event after client makes a wager", function (done) {
    var decision = {
      wager: 3
    }

    var initialState = {
      needChanceEvent: false,
      wager: 1,
      score: 0
    }

    var callback = function (error, data) {
      expect(error).toBe(null)
      expect(data.needChanceEvent).toBe(true)
      expect(data.wager).toBe(3)
      expect(data.score).toBe(0)
      done()
    }

    stateManager.advance(initialState, decision, callback)
  })

  it("should deduct wager from score if chance event is false", function (done) {
    var chanceEvent = {
      userWins: false
    }

    var initialState = {
      needChanceEvent: true,
      wager: 3,
      score: 5
    }

    var callback = function (error, data) {
      expect(error).toBe(null)
      expect(data.needChanceEvent).toBe(false)
      expect(data.wager).toBe(3)
      expect(data.score).toBe(2)
      done()
    }

    stateManager.advance(initialState, chanceEvent, callback)
  })

  it("should add wager to score if chance event is true", function (done) {
    var chanceEvent = {
      userWins: true
    }

    var initialState = {
      needChanceEvent: true,
      wager: 3,
      score: 5
    }

    var callback = function (error, data) {
      expect(error).toBe(null)
      expect(data.needChanceEvent).toBe(false)
      expect(data.wager).toBe(3)
      expect(data.score).toBe(8)
      done()
    }

    stateManager.advance(initialState, chanceEvent, callback)
  })

  it("should return error if an unexpected chance event is received")
  it("should return error if an unexpected client event is received")
})