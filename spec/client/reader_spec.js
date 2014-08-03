describe("The reader", function () {
  "use strict";

  var helpers = require("../spec_helper")
  var readerFactory = helpers.requireSource("client/reader")

  var mock = jasmine.createSpyObj
  var dummy = helpers.dummy
  var later = helpers.later

  var submitButton, wagerField, errorDiv, reader
  
  beforeEach(function () {
    submitButton = mock("submit button", ["prop", "off", "click"])
    wagerField = mock("wager field", ["val", "keypress"])
    errorDiv = mock("errors", ["text"])

    reader = readerFactory.buildReader({
      submitButton: submitButton,
      wagerField: wagerField,
      errorDiv: errorDiv
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
      reader.enable(dummy(), dummy())
      expect(submitButton.prop).toHaveBeenCalledWith("disabled", false)
    })

    it("should set the button's click event to trigger the callback", function () {
      var clientCallback = dummy()
      var inputFlags = dummy()
      var callbackWrapper = dummy()

      reader.buildOnClickCallback = function (data, callback) {
        expect(callback).toEqual(clientCallback)
        expect(data).toEqual(inputFlags)
        return callbackWrapper
      }

      reader.enable(inputFlags, clientCallback)

      expect(submitButton.click).toHaveBeenCalledWith(callbackWrapper)
    })
  })

  describe("building the onClick callback", function () {
    var textEnabled = {
      enableText: true,
      enableSubmit: true
    }

    var textDisabled = {
      enableText: false,
      enableSubmit: true
    }

    var expectError = function (decision, done) {
      reader.getDecision = function () {
        return decision
      }

      var clientCallback = jasmine.createSpy("callback")
      var callbackWrapper = reader.buildOnClickCallback(textEnabled, clientCallback)

      callbackWrapper()

      later(function () {
        expect(clientCallback).not.toHaveBeenCalled()
        expect(errorDiv.text).toHaveBeenCalledWith("Wager must be a positive number.")
        done()
      })
    }

    it("should not call the client callback", function () {
      var clientCallback = jasmine.createSpy("clientCallback")
      reader.buildOnClickCallback(textEnabled, clientCallback)
      expect(clientCallback).not.toHaveBeenCalled()
    })

    it("should not get a decision", function () {
      spyOn(reader, "getDecision")
      reader.buildOnClickCallback(textEnabled, dummy())
      expect(reader.getDecision).not.toHaveBeenCalled()
    })

    it("should return a function that sends the decision to the client callback", function (done) {
      var decision = { wager: 1 }
      reader.getDecision = function () { return decision }

      var clientCallback = function (data) {
        expect(data).toBe(decision)
        expect(errorDiv.text).toHaveBeenCalledWith("")
        done()
      }

      var callbackWrapper = reader.buildOnClickCallback(textEnabled, clientCallback)

      callbackWrapper()
    })

    it("should reject decision with a non-numerical wager", function (done) {
      expectError({ wager: "a potato" }, done)
    })

    it("should reject decision with a negative wager", function (done) {
      expectError({ wager: -1 }, done)
    })

    it("should reject decision with a zero wager", function (done) {
      expectError({ wager: 0 }, done)
    })

    it("should send empty decision if wager field is disabled", function (done) {
      spyOn(reader, "getDecision")

      var clientCallback = function (data) {
        expect(data).toEqual({})
        expect(reader.getDecision).not.toHaveBeenCalled()
        done()
      }

      var callbackWrapper = reader.buildOnClickCallback(textDisabled, clientCallback)

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
