describe("The game server", function () {
  "use strict";

  var helpers = require("../spec_helper")
  var dummy = helpers.dummy
  var mock = helpers.mock
  var gameServerFactory = helpers.requireSource("server/game_server")
  var events = helpers.requireSource("server/game_events")

  var gameServer, dispatcher, stateManager, chancePlayer

  beforeEach(function () {
    dispatcher = mock(["sendDispatch"])
    stateManager = mock(["initialize", "advance"])
    chancePlayer = mock(["getNextEvent"])
    gameServer = gameServerFactory.build(dispatcher, stateManager, chancePlayer)
  })

  describe("starting a game", function () {
    it("should query state manager for initial game state", function (done) {
      gameServer.start()

      process.nextTick(function () {
        expect(stateManager.initialize).toHaveBeenCalledWith(gameServer.getNextEvent)
        done()
      })
    })
  })

  describe("continuing a game", function () {
    it("should get a chance event if the state manager needs one", function (done) {
      var chanceEvent = dummy()
      var game = {
        nextEventType: events.chanceType
      }

      chancePlayer.getNextEvent.and.returnValue(chanceEvent)

      gameServer.getNextEvent(null, game)

      process.nextTick(function () {
        expect(stateManager.advance).toHaveBeenCalledWith(game, chanceEvent, gameServer.getNextEvent)
        done()
      })
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
          expect(stateManager.advance).toHaveBeenCalledWith(game, clientEvent, gameServer.getNextEvent)
          done()
        })
      }

      gameServer.getNextEvent(null, game)
    })
  })
})
