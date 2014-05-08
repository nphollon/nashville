describe("The renderer", function () {
  "use strict";
  var helpers = require("../spec_helper")
  var mock = helpers.mock
  var rendererFactory = helpers.requireSource("client/renderer")

  var wagerField, statusDiv, scoreDiv, renderer

  beforeEach(function () {
    wagerField = mock(["val"])
    statusDiv = mock(["text"])
    scoreDiv = mock(["text"])
    renderer = rendererFactory.buildRenderer({
      statusDiv: statusDiv, 
      wagerField: wagerField,
      scoreDiv: scoreDiv
    })
  })

  describe("displaying the data", function () {
    it("should set the wager amount in the wager field", function () {
      var wager = 8
      renderer.render({ wager: wager })
      expect(wagerField.val).toHaveBeenCalledWith(wager)
    })

    it("should set the status message", function () {
      var message = "status message"
      renderer.render({ message: message })
      expect(statusDiv.text).toHaveBeenCalledWith(message)
    })

    it("should set the score", function () {
      var score = 0
      renderer.render({ score: score })
      expect(scoreDiv.text).toHaveBeenCalledWith(score)
    })
  })
})
