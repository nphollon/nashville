"use strict";

exports.buildRenderer = function (interfaceElements) {
  var renderer = {} 

  renderer.render = function (data) {
    interfaceElements.wagerField.val(data.wager)
    interfaceElements.statusDiv.text(data.message)
    interfaceElements.scoreDiv.text(data.score)
  }

  return renderer
}