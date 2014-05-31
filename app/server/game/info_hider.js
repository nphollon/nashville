"use strict";

var async = require("async")
var events = require("./events")

exports.build = function (dispatcher, playerCount) {
  var infoHider = {}

  var buildDispatch = function (state, send) {
    var dispatch = []
    async.whilst(
      function () { return dispatch.length < playerCount },
      function (done) {
        dispatch.push(state.toResponse(dispatch.length))
        done()
      },
      function () { send(dispatch) }
    )
  }

  var extractDecision = function (callback, playerIndex) {
    return function (error, data) {
      process.nextTick(function () {
        if (error === null) {
          var decision = events.playerEvent(data[playerIndex])
          callback(null, decision)
        } else {
          callback(error)
        }
      })
    }
  }

  infoHider.sendDispatch = function (state, callback) {
    var playerIndex = state.nextPlayerIndex
    buildDispatch(state, function (dispatch) {
      dispatcher.sendDispatch(dispatch, extractDecision(callback, playerIndex))
    })
  }

  return infoHider
}