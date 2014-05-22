"use strict";

exports.buildReader = function (interfaceElements) {
  var reader = {}

  var submitButton = interfaceElements.submitButton
  var wagerField = interfaceElements.wagerField
  var errorDiv = interfaceElements.errorDiv

  var isValidWager = function (wager) {
    return (typeof wager === "number" && wager > 0)
  }

  wagerField.keypress(function (event) {
    if (event.which === 13) {
      submitButton.click()
    }
  })

  reader.enable = function (callback) {
    setButtonDisabled(false)
    submitButton.click(this.buildOnClickCallback(callback))
  }

  reader.disable = function () {
    setButtonDisabled(true)
    submitButton.off("click")
  }

  reader.buildOnClickCallback = function (clientCallback) {
    return function () {
      var decision = reader.getDecision()
      var canSubmit = isValidWager(decision.wager)
      var errorMessage = canSubmit ? "" : "Wager must be a positive number."

      process.nextTick(function () {
        errorDiv.text(errorMessage)
      })
      
      if (canSubmit) {
        process.nextTick(function () {
          clientCallback(decision)
        })
      }
    }
  }

  reader.getDecision = function () {
    return { wager: parseInt(wagerField.val()) }
  }

  var setButtonDisabled = function (isDisabled) {
    submitButton.prop("disabled", isDisabled)
  }

  return reader
}
