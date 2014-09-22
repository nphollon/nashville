describe("The renderer", function () {
  "use strict";
  var helpers = require("../spec_helper")
  var rendererFactory = helpers.requireSource("client/renderer")

  var mock = jasmine.createSpyObj
  var dummy = helpers.dummy
  var later = helpers.later

  var wagerField, statusDiv, playerPanels, renderer, instructionDiv, submitButton

  beforeEach(function () {
    wagerField = mock("wager-field", ["toggle"])
    statusDiv = mock("status-div", ["text"])
    instructionDiv = mock("instruction-div", ["text"])
    submitButton = mock("submit-button", ["val"])

    playerPanels = [
      {
        score: mock("player-1-score", ["text"]),
        card: mock("player-1-card", ["text"])
      },
      {
        score: mock("player-2-score", ["text"]),
        card: mock("player-2-card", ["text"])
      }
    ]

    renderer = rendererFactory.buildRenderer({
      statusDiv: statusDiv, 
      instructionDiv: instructionDiv,
      wagerField: wagerField,
      playerPanels: playerPanels,
      submitButton: submitButton
    })
  })

  it("should render data", function (done) {
    var data = {
      status: dummy(),
      players: [
        {
          score: dummy()
        },
        {
          score: dummy()
        }
      ],
      input: {
        enableText: dummy(),
        instruction: dummy(),
        action: dummy()
      }
    }

    renderer.render(data)
    assertDataDisplayed(data, done)
  })

  it("should display error message if an error is received", function (done) {
    var errorData = {
      status: "We're sorry. Something went wrong.",
      players: [
        {
          score: 0
        },
        {
          score: 0
        }
      ],
      input: {
        enableText: false,
        instruction: "",
        action: ""
      }
    }

    renderer.error()
    assertDataDisplayed(errorData, done)
  })

  var assertDataDisplayed = function (data, done) {
    later(function () {
      expect(statusDiv.text).toHaveBeenCalledWith(data.status)

      expect(wagerField.toggle).toHaveBeenCalledWith(data.input.enableText)
      expect(instructionDiv.text).toHaveBeenCalledWith(data.input.instruction)
      expect(submitButton.val).toHaveBeenCalledWith(data.input.action)
      
      expect(playerPanels[0].score.text).toHaveBeenCalledWith(data.players[0].score)
      expect(playerPanels[1].score.text).toHaveBeenCalledWith(data.players[1].score)
      expect(playerPanels[0].card.text).toHaveBeenCalledWith(1)
      expect(playerPanels[1].card.text).toHaveBeenCalledWith(1)
      done()
    })
  }
})
