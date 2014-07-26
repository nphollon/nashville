"use strict";

exports.buildRenderer = function (interfaceElements) {
  var renderer = {} 

  renderer.render = function (data) {
    interfaceElements.wagerField.val(data.wager)
    interfaceElements.statusDiv.text(data.status)
    interfaceElements.instructionDiv.text(data.input.instruction)
    interfaceElements.submitButton.val(data.input.action)

    interfaceElements.scoreDivs.forEach(function (scoreDiv, i) {
      scoreDiv.text(data.scores[i])
    })
  }

  renderer.error = function () {
    this.render({
      playerIndex: 0,
      status: "We're sorry. Something went wrong.",
      scores: [0, 0],
      wager: 0,
      input: {
        instruction: "",
        action: ""
      }
    })
  }

  return renderer
}