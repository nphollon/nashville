describe("The referee", function () {
  "use strict";

  var helpers = require("../spec_helper")
  var dummy = helpers.dummy
  var mock = helpers.mock
  var refereeFactory = helpers.requireSource("server/referee")

  var referee, dispatcher, stateManager, chancePlayer

  beforeEach(function () {
    dispatcher = mock(["sendDispatch"])
    stateManager = mock(["initialize", "advance"])
    chancePlayer = mock(["getNextEvent"])
    referee = refereeFactory.buildReferee(dispatcher, stateManager, chancePlayer)
  })

  describe("starting a game", function () {
    it("should query state manager for initial game state", function (done) {
      referee.startGame()

      process.nextTick(function () {
        expect(stateManager.initialize).toHaveBeenCalledWith(referee.getNextEvent)
        done()
      })
    })
  })

  describe("continuing a game", function () {
    it("should get a chance event if the state manager needs one", function (done) {
      var chanceEvent = dummy()
      var game = {
        needChanceEvent: true,
      }

      chancePlayer.getNextEvent.and.returnValue(chanceEvent)

      referee.getNextEvent(null, game)

      process.nextTick(function () {
        expect(stateManager.advance).toHaveBeenCalledWith(game, chanceEvent, referee.getNextEvent)
        done()
      })
    })

    it("should get a client event from the dispatcher if the state manager needs one", function (done) {
      var clientEvent = dummy()

      var game = {
        needChanceEvent: false,
      }

      dispatcher.sendDispatch = function (data, callback) {
        expect(data).toBe(game)

        callback(null, clientEvent)

        process.nextTick(function () {
          expect(stateManager.advance).toHaveBeenCalledWith(game, clientEvent, referee.getNextEvent)
          done()
        })
      }

      referee.getNextEvent(null, game)
    })
  })
})
