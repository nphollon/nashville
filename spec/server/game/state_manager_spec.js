"use strict";

describe("The state manager", function () {
  var helpers = require("../../spec_helper")
  var stateManagerFactory = helpers.requireSource("server/game/state_manager")
  var dummy = helpers.dummy

  var stateManager, expectedState, goodDecision, dispatcher, mutator

  beforeEach(function () {
    dispatcher = {}
    mutator = {}

    stateManager = stateManagerFactory.build(dispatcher, mutator)
    
    expectedState = { nextEventType: "dummy" }
    goodDecision = { type: "dummy" }
  })
  
  it("should send the state to the dispatcher", function (done) {
    dispatcher.sendDispatch = function (dispatch) {
      expect(dispatch).toBe(expectedState)
      done()
    }

    stateManager.start(expectedState)
  })

  it("should send an error if an unexpected event type is received", function (done) {
    var badDecision = { type: "unexpected" }

    dispatcher.sendDispatch = function (dispatch, callback) {
      callback(null, badDecision)
    }

    dispatcher.sendError = function (error) {
      expect(error.message).toBe("State manager received invalid decision.")
      expect(error.decision).toEqual(badDecision)
      expect(error.state).toEqual(expectedState)
      done()
    }

    stateManager = stateManagerFactory.build(dispatcher, dummy())
    stateManager.start(expectedState)
  })

  it("should invoke mutation corresponding to decision type", function (done) {
    mutator.dummy = function (state, decision) {
      expect(state).toBe(expectedState)
      expect(decision).toBe(goodDecision)
      done()
    }

    dispatcher.sendDispatch = function (dispatch, callback) {
      callback(null, goodDecision)
    }

    stateManager = stateManagerFactory.build(dispatcher, mutator)
    stateManager.start(expectedState)
  })

  it("should send errors from the mutator to the dispatcher", function (done) {
    var expectedError = dummy()

    mutator.dummy = function (state, decision, callback) {
      callback(expectedError)
    }

    dispatcher.sendDispatch = function (dispatch, callback) {
      callback(null, goodDecision)
    }

    dispatcher.sendError = function (error) {
      expect(error).toBe(expectedError)
      done()
    }

    stateManager.start(expectedState)
  })
})