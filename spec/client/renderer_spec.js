describe("The renderer", function () {
  "use strict";
  var helpers = require("../spec_helper")
  var rendererFactory = helpers.requireSource("client/renderer")
  var mock = jasmine.createSpyObj
  var dummy = helpers.dummy

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
    it("should set the wager, status message, and score", function () {
      var data = {
        playerIndex: 1,
        wager: dummy(),
        status: dummy(),
        scores: [ null, dummy(), null ]
      }

      renderer.render(data)
      expect(wagerField.val).toHaveBeenCalledWith(data.wager)
      expect(statusDiv.text).toHaveBeenCalledWith(data.status)
      expect(scoreDiv.text).toHaveBeenCalledWith(data.scores[1])
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
