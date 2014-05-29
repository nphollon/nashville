describe("The game", function () {
  "use strict";

  var depdep = require("depdep")
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

    gameServer: function (that) {
      return requireSource("server/game/game_server").build(
        that.infoHider,
        that.stateManager,
        that.chancePlayer
      )
    },

    stateManager: function (that) {
      return requireSource("server/game/state_manager").build(that.playerCount)
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


  xit("plays a 2 player game", function (done) {
    var context = depdep.buildContext(factories)
    var splitter = context.splitter

    context.gameServer.start()

    splitter.submitDecision(1)(dummy(), dummy())

    splitter.submitDecision(0)({ wager: 2 }, function (error, data) {
      expect(error).toBe(null)
      expect(data).toEqual({
        enableInput: true,
        status: "You won.",
        score: 2,
        wager: 2
      })
      done()
    })
  })
})