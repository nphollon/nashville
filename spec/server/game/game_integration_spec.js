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


  it("plays a 2 player game", function (testDone) {
    var context = depdep.buildContext(factories)

    var play = function (round) {
      return function (done) {
        async.each([0, 1, 2], function (i, taskDone) {
          var submit = context.splitter.input(i).submitDecision
          var testData = round[i]

          submit(testData.decision, function (error, data) {
            expect(error).toBe(null)
            expect(data).toEqual(testData.expectedResponse)
            taskDone()
          })
        }, done)
      }
    }

    context.gameDriver.start(context.playerCount)

    var waitForStart = function (taskDone) {
      context.splitter.input(0).requestUpdate(taskDone)
    }

    var firstRound = [
      {
        decision: events.playerEvent({ wager: 2 }),
        expectedResponse: {
          playerIndex: 0,
          enableInput: false,
          scores: [0, 0],
          status: jasmine.any(String),
          wager: 2
        }
      },
      {
        decision: dummy(),
        expectedResponse: {
          playerIndex: 1,
          enableInput: false,
          scores: [0, 0],
          status: jasmine.any(String),
          wager: 2
        }
      },
      {
        decision: dummy(),
        expectedResponse: jasmine.any(Object)
      }
    ]

    var secondRound = [
      {
        decision: dummy(),
        expectedResponse: {
          playerIndex: 0,
          enableInput: false,
          scores: [2, -2],
          status: "You won.",
          wager: 2
        }
      },
      {
        decision: dummy(),
        expectedResponse: {
          playerIndex: 1,
          enableInput: true,
          scores: [2, -2],
          status: "You lost.",
          wager: 2
        }
      },
      {
        decision: events.chanceEvent(0),
        expectedResponse: jasmine.any(Object)
      }
    ]

    async.series([waitForStart, play(firstRound), play(secondRound), testDone])
  })
})