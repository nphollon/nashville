describe("The game driver", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var driverFactory = helpers.requireSource("server/game/driver")
  var states = helpers.requireSource("server/game/states")
  var dummy = helpers.dummy

  var driver, dispatcher, stateManager

  beforeEach(function () {
    dispatcher = {}
    stateManager = {}
    driver = driverFactory.build(dispatcher, stateManager)
  })

  describe("starting a game", function () {
    it("should query state manager for initial game state", function (done) {
      var expectedPlayerCount = 3
      var state = dummy()
      spyOn(states, "build").and.callFake(function (playerCount) {
        return (playerCount === expectedPlayerCount) ? state : undefined
      })

      driver.getNextEvent = function (error, data) {
        expect(error).toBe(null)
        expect(data).toBe(state)
        done()
      }
      
      driver.start(expectedPlayerCount)
    })
  })

  describe("continuing a game", function () {
    it("should get a client event from the dispatcher", function (done) {
      var clientEvent = dummy()
      var game = dummy()

      stateManager.advance = function (state, event, callback) {
        expect(state).toBe(game)
        expect(event).toBe(clientEvent)
        expect(callback).toBe(driver.getNextEvent)
        done()
      }

      dispatcher.sendDispatch = function (data, callback) {
        expect(data).toBe(game)
        callback(null, clientEvent)
      }

      driver.getNextEvent(null, game)
    })
  })
})
