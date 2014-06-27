describe("The game", function () {
  "use strict";

  var async = require("async")
  var helpers = require("../../spec_helper")
  var requireSource = helpers.requireSource
  var events = requireSource("server/game/events")
  var dummy = helpers.dummy

  it("plays a 2 player game", function (testDone) {
    var context = requireSource("server/application").build().context
    var splitter = context.splitter
    var driver = context.gameDriver

    var play = function (round) {
      return function (roundDone) {
        async.each([0, 1, 2], function (i, taskDone) {
          var submit = splitter.input(i).submitDecision
          var testData = round[i]

          submit(testData.decision, function (error, data) {
            expect(error).toBe(null)
            expect(data).toEqual(testData.expectedResponse)
            taskDone()
          })
        }, roundDone)
      }
    }

    driver.start(context.startState)

    var waitForStart = function (taskDone) {
      splitter.input(0).requestUpdate(taskDone)
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