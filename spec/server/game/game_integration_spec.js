describe("The game", function () {
  "use strict";

  var depdep = require("depdep")
  var async = require("async")
  var helpers = require("../../spec_helper")
  var requireSource = helpers.requireSource
  var dummy = helpers.dummy

  var factories = {
    playerCount: function () {
      return 2
    },

    splitter: function (that) {
      return requireSource("server/web/splitter").build(
        that.dispatcher,
        that.playerCount
      )
    },

    dispatcher: function () {
      return requireSource("server/web/dispatcher").build()
    },

    infoHider: function (that) {
      return requireSource("server/game/info_hider").build(
        that.dispatcher,
        that.playerCount
      )
    },

    gameDriver: function (that) {
      return requireSource("server/game/driver").build(
        that.infoHider,
        that.stateManager,
        that.chancePlayer
      )
    },

    stateManager: function () {
      return requireSource("server/game/state_manager").build()
    },

    chancePlayer: function (that) {
      return requireSource("server/game/chance_player").build(that.random)
    },

    random: function () {
      return {
        integer: function () { return 0 }
      }
    }
  }

  var play = function (round) {
    return function (done) {
      async.parallel(round, done)
    }
  }

  it("plays a 2 player game", function (testDone) {
    var context = depdep.buildContext(factories)
    var playerOne = context.splitter.input(0)
    var playerTwo = context.splitter.input(1)

    context.gameDriver.start(context.playerCount)

    var firstRound = [
      function (taskDone) {
        playerOne.submitDecision({ wager: 2 }, function (error, data) {
          expect(error).toBe(null)
          expect(data).toEqual({
            playerIndex: 0,
            enableInput: false,
            scores: [2, -2],
            status: "You won.",
            wager: 2
          })
          taskDone()
        })
      },
      function (taskDone) {
        playerTwo.submitDecision(dummy(), function (error, data) {
          expect(error).toBe(null)
          expect(data).toEqual({
            playerIndex: 1,
            enableInput: true,
            scores: [2, -2],
            status: "You lost.",
            wager: 2
          })
          taskDone()
        })
      }
    ]

    var secondRound = [
      function (taskDone) {
        playerOne.submitDecision(dummy(), function (error, data) {
          expect(error).toBe(null)
          expect(data).toEqual({
            playerIndex: 0,
            enableInput: true,
            scores: [7, -7],
            status: "You won.",
            wager: 5
          })
          taskDone()
        })
      },
      function (taskDone) {
        playerTwo.submitDecision({ wager: 5 }, function (error, data) {
          expect(error).toBe(null)
          expect(data).toEqual({
            playerIndex: 1,
            enableInput: false,
            scores: [7, -7],
            status: "You lost.",
            wager: 5
          })
          taskDone()
        })
      }
    ]

    async.series([play(firstRound), play(secondRound)], testDone)
  })
})