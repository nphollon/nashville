describe("The game driver", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var dummy = helpers.dummy
  var mock = jasmine.createSpyObj
  var driverFactory = helpers.requireSource("server/game/driver")
  var events = helpers.requireSource("server/game/events")
  var states = helpers.requireSource("server/game/states")

  var driver, dispatcher, stateManager, chancePlayer

  beforeEach(function () {
    dispatcher = mock("dispatcher", ["sendDispatch"])
    stateManager = mock("state manager", ["initialize", "advance"])
    chancePlayer = mock("chance player", ["getNextEvent"])
    driver = driverFactory.build(dispatcher, stateManager, chancePlayer)
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
    it("should get a chance event if the state manager needs one", function (done) {
      var chanceEvent = dummy()
      var game = {
        nextEventType: events.chanceType
      }

      chancePlayer.getNextEvent = function (data, callback) {
        expect(data).toBe(game)

        callback(null, chanceEvent)

        process.nextTick(function () {
          expect(stateManager.advance).toHaveBeenCalledWith(game, chanceEvent, driver.getNextEvent)
          done()
        })
      }

      driver.getNextEvent(null, game)
    })

    it("should get a client event from the dispatcher if the state manager needs one", function (done) {
      var clientEvent = dummy()

      var game = {
        nextEventType: events.playerType
      }

      dispatcher.sendDispatch = function (data, callback) {
        expect(data).toBe(game)

        callback(null, clientEvent)

        process.nextTick(function () {
          expect(stateManager.advance).toHaveBeenCalledWith(game, clientEvent, driver.getNextEvent)
          done()
        })
      }

      driver.getNextEvent(null, game)
    })
  })
})
