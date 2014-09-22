"use strict";

var zipMap = require("../util/async").zipMap

exports.buildRenderer = function (elements) {
  var renderer = {}

  var renderInput = function (input) {
    elements.wagerField.toggle(input.enableText)
    elements.instructionDiv.text(input.instruction)
    elements.submitButton.val(input.action)
  }

  renderer.render = function (data) {
    elements.statusDiv.text(data.status)

    renderInput(data.input)

    zipMap([elements.playerPanels, data.players], function (panel, playerData, done) {
      panel.score.text(playerData.score)
      panel.card.text(1)
      done()
    })
  }

  renderer.error = function () {
    this.render({
      status: "We're sorry. Something went wrong.",
      players: [
        {
          score: 0
        },
        {
          score: 0
        }
      ],
      input: {
        enableText: false,
        instruction: "",
        action: ""
      }
    })
  }

  return renderer
}