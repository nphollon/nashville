"use strict";

describe("The state manager", function () {
  var helpers = require("./spec_helper")
  var stateManagerFactory = helpers.requireSource("server/state_manager")
  var stateManager

  beforeEach(function () {
    stateManager = stateManagerFactory.build()
  })

  xit("should initialize the game state", function (done) {
    var expectedState = {
      needChanceEvent: false
    }
    var callback = function (error, data) {
      expect(error).toBe(null)
      expect(data).toEqual(expectedState)
      done()
    }

    stateManager.initialize(callback)
  })
})