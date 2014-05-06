describe("The referee", function () {
  "use strict";

  var helpers = require("./spec_helper")
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
      referee.start()

      process.nextTick(function () {
        expect(stateManager.initialize).toHaveBeenCalledWith(referee.queryNextPlayer)
        done()
      })
    })
  })

  describe("querying the next player", function () {
    it("should send the game state to the dispatcher if it is a player's turn", function (done) {
      var game = {
        needChanceEvent: false,
        state: dummy()
      }

      referee.queryNextPlayer(game)

      process.nextTick(function () {
        expect(dispatcher.sendDispatch).toHaveBeenCalledWith(game.state, referee.updateGame)
        done()
      })
    })

    it("should send a chance event to the state manager if it asks for one", function (done) {
      var chanceEvent = dummy()
      var game = {
        needChanceEvent: true,
        state: dummy()
      }

      chancePlayer.getNextEvent.and.returnValue(chanceEvent)

      referee.queryNextPlayer(game)

      process.nextTick(function () {
        expect(stateManager.advance).toHaveBeenCalledWith(game.state, chanceEvent, referee.queryNextPlayer)
        done()
      })
    })
  })

  describe("updating the game state", function () {
    
  })
})

/**

External dependencies:
  dispatcher
  game state manager
  chance player

updateGame = (error, clientPly) ->
  update(game, clientPly, queryNextPlayer)

queryNextPlayer = (error, game) ->
  if chance is next
    get chancePly
    updateGame(null, chancePly)
  else
    dispatcher.sendDispatch(newGame, updateGame)
  
**/
