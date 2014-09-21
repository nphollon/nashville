describe("The game", function () {
  "use strict";

  var async = require("async")
  var helpers = require("../../spec_helper")
  var requireSource = helpers.requireSource
  var events = requireSource("server/game/events")
  var dummy = helpers.dummy

  it("plays a 2 player game", function (testDone) {
    var context = requireSource("server/game/game").build({
      deciders: [null, null, null]
    })
    var splitter = context.splitter

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

    var waitForStart = function (taskDone) {
      splitter.input(0).requestUpdate(taskDone)
    }

    var firstRound = [
      {
        decision: events.playerEvent({ wager: 2 }),
        expectedResponse: {
          playerIndex: 0,
          wager: 2,
          scores: [0, 0],
          status: "Player 1 has bet $2",
          input: {
            enableText: false,
            enableSubmit: false,
            instruction: "",
            action: ""
          }
        }
      },
      {
        decision: dummy(),
        expectedResponse: {
          playerIndex: 1,
          wager: 2,
          scores: [0, 0],
          status: "Player 1 has bet $2",
          input: {
            enableText: false,
            enableSubmit: true,
            instruction: "",
            action: "Continue"
          }
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
          wager: 2,
          scores: [2, -2],
          status: "Player 1 has won",
          input: {
            enableText: false,
            enableSubmit: true,
            instruction: "",
            action: "Continue"
          }
        }
      },
      {
        decision: dummy(),
        expectedResponse: {
          playerIndex: 1,
          wager: 2,
          scores: [2, -2],
          status: "Player 1 has won",
          input: {
            enableText: true,
            enableSubmit: true,
            instruction: "Place a wager",
            action: "Submit"
          }
        }
      },
      {
        decision: events.chanceEvent(0),
        expectedResponse: jasmine.any(Object)
      }
    ]

    var thirdRound = [
      {
        decision: dummy(),
        expectedResponse: {
          playerIndex: 0,
          wager: 10,
          scores: [2, -2],
          status: "Player 2 has bet $10",
          input: {
            enableText: false,
            enableSubmit: true,
            instruction: "",
            action: "Continue"
          }
        }
      },
      {
        decision: events.playerEvent({ wager: 10 }),
        expectedResponse: {
          playerIndex: 1,
          wager: 10,
          scores: [2, -2],
          status: "Player 2 has bet $10",
          input: {
            enableText: false,
            enableSubmit: false,
            instruction: "",
            action: ""
          }
        }
      },
      {
        decision: dummy(),
        expectedResponse: jasmine.any(Object)
      }
    ]

    var fourthRound = [
      {
        decision: dummy(),
        expectedResponse: {
          playerIndex: 0,
          wager: 10,
          scores: [12, -12],
          status: "Player 1 has won",
          input: {
            enableText: true,
            enableSubmit: true,
            instruction: "Place a wager",
            action: "Submit"
          }
        }
      },
      {
        decision: dummy(),
        expectedResponse: {
          playerIndex: 1,
          wager: 10,
          scores: [12, -12],
          status: "Player 1 has won",
          input: {
            enableText: false,
            enableSubmit: true,
            instruction: "",
            action: "Continue"
          }
        }
      },
      {
        decision: events.chanceEvent(0),
        expectedResponse: jasmine.any(Object)
      }
    ]

    async.series([
      waitForStart,
      play(firstRound), 
      play(secondRound),
      play(thirdRound),
      play(fourthRound),
      testDone
    ])
  })
})