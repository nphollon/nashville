"use strict";

exports.buildRenderer = function (interfaceElements) {
  var renderer = {} 

  renderer.render = function (data) {
    interfaceElements.wagerField.val(data.wager)
    interfaceElements.statusDiv.text(data.status)
    interfaceElements.scoreDiv.text(data.scores[data.playerIndex])
  }

  renderer.error = function () {
    this.render({
      playerIndex: 0,
      status: "We're sorry. Something went wrong.",
      scores: [0],
      wager: 0
    })
  }

  return renderer
}