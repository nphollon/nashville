describe("The renderer", function () {
  "use strict";
  var helpers = require("../spec_helper")
  var rendererFactory = helpers.requireSource("client/renderer")
  var mock = jasmine.createSpyObj

  var wagerField, statusDiv, scoreDiv, renderer

  beforeEach(function () {
    wagerField = mock("wager field", ["val"])
    statusDiv = mock("status div", ["text"])
    scoreDiv = mock("score div", ["text"])
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
      renderer.render({ status: message })
      expect(statusDiv.text).toHaveBeenCalledWith(message)
    })

    it("should set the score", function () {
      var score = 0
      renderer.render({ score: score })
      expect(scoreDiv.text).toHaveBeenCalledWith(score)
    })
  })

  describe("displaying an error", function () {
    it("should zero interface and display error message", function () {
      renderer.error()
      expect(statusDiv.text).toHaveBeenCalledWith("We're sorry. Something went wrong.")
      expect(wagerField.val).toHaveBeenCalledWith(0)
      expect(scoreDiv.text).toHaveBeenCalledWith(0)
    })
  })
})
