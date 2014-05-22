"use strict";

exports.buildRenderer = function (interfaceElements) {
  var renderer = {} 

  renderer.render = function (data) {
    interfaceElements.wagerField.val(data.wager)
    interfaceElements.statusDiv.text(data.status)
    interfaceElements.scoreDiv.text(data.score)
  }

  renderer.error = function () {
    this.render({
      status: "We're sorry. Something went wrong.",
      score: 0,
      wager: 0
    })
  }

  return renderer
}