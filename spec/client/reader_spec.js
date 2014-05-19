describe("The reader", function () {
  "use strict";

  var helpers = require("../spec_helper")
  var mock = jasmine.createSpyObj
  var dummy = helpers.dummy
  var readerFactory = helpers.requireSource("client/reader")

  var submitButton, wagerField, reader
  
  beforeEach(function () {
    submitButton = mock("submit button", ["prop", "off", "click"])
    wagerField = mock("wager field", ["val", "keypress"])
    reader = readerFactory.buildReader({
      submitButton: submitButton,
      wagerField: wagerField
    })
  })

  describe("disabling user input", function () {
    it("should disable the submit button", function() {
      reader.disable()
      expect(submitButton.prop).toHaveBeenCalledWith("disabled", true)
    })

    it("should remove the callback from the submit button", function() {
      reader.disable()
      expect(submitButton.off).toHaveBeenCalledWith("click")
    })
  })

  describe("enabling user input", function () {
    it("should enable the submit button", function () {
      reader.enable(dummy())
      expect(submitButton.prop).toHaveBeenCalledWith("disabled", false)
    })

    it("should set the button's click event to trigger the callback", function () {
      var clientCallback = dummy()
      var callbackWrapper = dummy()

      reader.buildOnClickCallback = function (callback) {
        return (callback === clientCallback) ? callbackWrapper : undefined
      }

      reader.enable(clientCallback)

      expect(submitButton.click).toHaveBeenCalledWith(callbackWrapper)
    })
  })

  describe("building the onClick callback", function () {
    it("should not call the client callback", function () {
      var clientCallback = jasmine.createSpy("clientCallback")
      reader.buildOnClickCallback(clientCallback)
      expect(clientCallback).not.toHaveBeenCalled()
    })

    it("should not get a decision", function () {
      spyOn(reader, "getDecision")
      reader.buildOnClickCallback(dummy())
      expect(reader.getDecision).not.toHaveBeenCalled()
    })

    it("should return a function that sends the decision to the client callback", function (done) {
      var decision = dummy()
      reader.getDecision = function () { return decision }

      var clientCallback = function (data) {
        expect(data).toBe(decision)
        done()
      }

      var callbackWrapper = reader.buildOnClickCallback(clientCallback)

      callbackWrapper()
    })
  })

  describe("getting the decision from the user interface", function () {
    it("should return the wager in the decision", function () {
      var wager = 7
      wagerField.val.and.returnValue(wager.toString())

      var decision = reader.getDecision()

      expect(decision.wager).toBe(wager)
    })
  })
})
