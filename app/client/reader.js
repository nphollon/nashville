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
    var decision = this.getDecision()
    return function () {
      clientCallback(decision)
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
