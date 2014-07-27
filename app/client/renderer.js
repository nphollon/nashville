"use strict";

exports.buildRenderer = function (interfaceElements) {
  var renderer = {} 

  renderer.render = function (data) {
    interfaceElements.wagerField.toggle(data.input.enableText)
    interfaceElements.statusDiv.text(data.status)
    interfaceElements.instructionDiv.text(data.input.instruction)
    interfaceElements.submitButton.val(data.input.action)

    interfaceElements.scoreDivs.forEach(function (scoreDiv, i) {
      scoreDiv.text(data.scores[i])
    })
  }

  renderer.error = function () {
    this.render({
      status: "We're sorry. Something went wrong.",
      scores: [0, 0],
      input: {
        enableText: false,
        instruction: "",
        action: ""
      }
    })
  }

  return renderer
}