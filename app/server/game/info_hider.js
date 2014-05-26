"use strict";

exports.build = function (dispatcher, playerCount) {
  var infoHider = {}

  var buildDispatch = function (state) {
    var dispatch = []
    while (dispatch.length < playerCount) {
      dispatch.push(state)
    }
    return dispatch
  }

  var extractDecision = function (callback, playerIndex) {
    return function (error, data) {
      process.nextTick(function () {
        if (error === null) {
          callback(null, data[playerIndex])
        } else {
          callback(error)
        }
      })
    }
  }

  infoHider.sendDispatch = function (state, callback) {
    var dispatch = buildDispatch(state)
    var playerIndex = state.nextPlayerIndex
    dispatcher.sendDispatch(dispatch, extractDecision(callback, playerIndex))
  }

  return infoHider
}