describe("The renderer", function () {
  "use strict";
  var helpers = require("../spec_helper")
  var rendererFactory = helpers.requireSource("client/renderer")
  var mock = jasmine.createSpyObj
  var dummy = helpers.dummy

  var wagerField, statusDiv, scoreDivs, renderer, instructionDiv, submitButton

  beforeEach(function () {
    wagerField = mock("wager field", ["val"])
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

  describe("displaying the data", function () {
    it("should set the wager, status message, and score", function () {
      var data = {
        playerIndex: 1,
        wager: dummy(),
        status: dummy(),
        scores: [ dummy(), dummy() ],
        input: {
          instruction: dummy(),
          action: dummy()
        }
      }

      renderer.render(data)
      expect(wagerField.val).toHaveBeenCalledWith(data.wager)
      expect(statusDiv.text).toHaveBeenCalledWith(data.status)
      expect(scoreDivs[0].text).toHaveBeenCalledWith(data.scores[0])
      expect(scoreDivs[1].text).toHaveBeenCalledWith(data.scores[1])
      expect(instructionDiv.text).toHaveBeenCalledWith(data.input.instruction)
      expect(submitButton.val).toHaveBeenCalledWith(data.input.action)
    })
  })

  describe("displaying an error", function () {
    it("should zero interface and display error message", function () {
      renderer.error()
      expect(statusDiv.text).toHaveBeenCalledWith("We're sorry. Something went wrong.")
      expect(wagerField.val).toHaveBeenCalledWith(0)
      expect(scoreDivs[0].text).toHaveBeenCalledWith(0)
      expect(scoreDivs[1].text).toHaveBeenCalledWith(0)
      expect(instructionDiv.text).toHaveBeenCalledWith("")
      expect(submitButton.val).toHaveBeenCalledWith("")
    })
  })
})
