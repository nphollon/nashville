describe("The renderer", function () {
  "use strict";
  var helpers = require("../spec_helper")
  var rendererFactory = helpers.requireSource("client/renderer")
  var mock = jasmine.createSpyObj
  var dummy = helpers.dummy

  var wagerField, statusDiv, scoreDivs, renderer, instructionDiv, submitButton

  beforeEach(function () {
    wagerField = mock("wager field", ["toggle"])
    statusDiv = mock("status div", ["text"])
    instructionDiv = mock("instruction div", ["text"])
    submitButton = mock("submitButton", ["val"])
    scoreDivs = [ mock("player 1 score", ["text"]), mock("player 2 score", ["text"]) ]
    renderer = rendererFactory.buildRenderer({
      statusDiv: statusDiv, 
      instructionDiv: instructionDiv,
      wagerField: wagerField,
      scoreDivs: scoreDivs,
      submitButton: submitButton
    })
  })

  it("should render data", function () {
    var data = {
      status: dummy(),
      scores: [ dummy(), dummy() ],
      input: {
        enableText: dummy(),
        instruction: dummy(),
        action: dummy()
      }
    }

    renderer.render(data)
    assertDataDisplayed(data)
  })

  it("should display error message if an error is received", function () {
    renderer.error()
    assertDataDisplayed({
      status: "We're sorry. Something went wrong.",
      scores: [0, 0],
      input: {
        enableText: false,
        instruction: "",
        action: ""
      }
    })
  })

  var assertDataDisplayed = function (data) {
    expect(wagerField.toggle).toHaveBeenCalledWith(data.input.enableText)
    expect(statusDiv.text).toHaveBeenCalledWith(data.status)
    expect(scoreDivs[0].text).toHaveBeenCalledWith(data.scores[0])
    expect(scoreDivs[1].text).toHaveBeenCalledWith(data.scores[1])
    expect(instructionDiv.text).toHaveBeenCalledWith(data.input.instruction)
    expect(submitButton.val).toHaveBeenCalledWith(data.input.action)
  }
})
