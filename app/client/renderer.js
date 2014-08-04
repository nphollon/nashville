"use strict";

var zipMap = require("../util/async").zipMap

exports.buildRenderer = function (interfaceElements) {
  var renderer = {} 

  renderer.render = function (data) {
    interfaceElements.wagerField.toggle(data.input.enableText)
    interfaceElements.statusDiv.text(data.status)
    interfaceElements.instructionDiv.text(data.input.instruction)
    interfaceElements.submitButton.val(data.input.action)

    zipMap([interfaceElements.scoreDivs, data.scores], function (div, score, done) {
      div.text(score)
      done()
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