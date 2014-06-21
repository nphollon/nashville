describe("The game", function () {
  "use strict";

  var depdep = require("depdep")
  var async = require("async")
  var helpers = require("../../spec_helper")
  var requireSource = helpers.requireSource
  var events = requireSource("server/game/events")
  var dummy = helpers.dummy

  var factories = {
    playerCount: function () {
      return 2
    },

    splitter: function (that) {
      return requireSource("server/web/splitter").build(
        that.dispatcher,
        that.playerCount + 1
      )
    },

    dispatcher: function () {
      return requireSource("server/web/dispatcher").build()
    },

    infoHider: function (that) {
      return requireSource("server/game/info_hider").build(
        that.dispatcher,
        that.playerCount + 1
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
    var chancePlayer = context.splitter.input(2)

    context.gameDriver.start(context.playerCount)

    var waitForStart = function (taskDone) {
      playerOne.requestUpdate(taskDone)
    }

    var firstRound = [
      function (taskDone) {
        playerOne.submitDecision(events.playerEvent({ wager: 2 }), function (error, data) {
          expect(error).toBe(null)
          expect(data).toEqual({
            playerIndex: 0,
            enableInput: false,
            scores: [0, 0],
            status: jasmine.any(String),
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
            enableInput: false,
            scores: [0, 0],
            status: jasmine.any(String),
            wager: 2
          })
          taskDone()
        })
      },
      function (taskDone) {
        chancePlayer.submitDecision(dummy(), taskDone)
      }
    ]

    var secondRound = [
      function (taskDone) {
        playerOne.submitDecision(dummy(), function (error, data) {
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
      },
      function (taskDone) {
        chancePlayer.submitDecision(events.chanceEvent(0), taskDone)
      }
    ]

    async.series([waitForStart, play(firstRound), play(secondRound), testDone])
  })
})