"use strict";

exports.buildReader = function (interfaceElements) {
  var reader = {}

  var submitButton = interfaceElements.submitButton
  var wagerField = interfaceElements.wagerField

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
      process.nextTick(function () {
        clientCallback(decision)
      })
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
