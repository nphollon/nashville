"use strict";

var fullInputEnabled = {
  enableText: true,
  enableSubmit: true,
  instruction: "Place a wager",
  action: "Submit"
}

var confirmationEnabled = {
  enableText: false,
  enableSubmit: true,
  instruction: "",
  action: "Continue"
}

var noInputEnabled = {
  enableText: false,
  enableSubmit: false,
  instruction: "",
  action: ""
}

Object.freeze(fullInputEnabled)
Object.freeze(confirmationEnabled)
Object.freeze(noInputEnabled)

var inputSettings = function (playerIndex, nextPlayerIndex, lastPlayerIndex) {
  if (playerIndex === nextPlayerIndex) {
    return fullInputEnabled
  }
  if (playerIndex === lastPlayerIndex) {
    return noInputEnabled
  }
  return confirmationEnabled
}

module.exports = function (state, playerIndex, callback) {
  var response = {
    playerIndex: playerIndex,
    wager: state.wager,
    players: state.scores.map(function (score) { return { score: score, card: 1 } }),
    status: state.status,
    input: inputSettings(playerIndex, state.nextPlayerIndex, state.lastPlayerIndex)
  }
  
  Object.freeze(response)

  process.nextTick(function () {
    callback(response)
  })
}