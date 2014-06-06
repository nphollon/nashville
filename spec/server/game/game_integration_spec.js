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
        bool: function () { return true }
      }
    }
  }


  it("plays a 2 player game", function (testDone) {
    var context = depdep.buildContext(factories)
    var splitter = context.splitter

    context.gameDriver.start(context.playerCount)

    var firstRound = [
      function (taskDone) {
        splitter.submitDecision(0)({ wager: 2 }, function (error, data) {
          expect(error).toBe(null)
          expect(data).toEqual({
            playerIndex: 0,
            enableInput: true,
            scores: [2, -2],
            status: "You won.",
            wager: 2
          })
          taskDone()
        })
      },
      function (taskDone) {
        splitter.submitDecision(1)(dummy(), function (error, data) {
          expect(error).toBe(null)
          expect(data).toEqual({
            playerIndex: 1,
            enableInput: false,
            scores: [2, -2],
            status: "You lost.",
            wager: 2
          })
          taskDone()
        })
      }
    ]

    async.parallel(firstRound, testDone)
  })
})