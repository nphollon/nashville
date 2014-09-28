"use strict";

var async = require("async")

exports.build = function (dispatcher, toResponse, playerCount) {
  var infoHider = {}

  var buildDispatch = function (state, send) {
    var dispatch = []
    async.whilst(
      function () { return dispatch.length < playerCount },
      function (done) {
        toResponse(state, dispatch.length, function (response) {
          dispatch.push(response)
          done()
        })
      },
      function () { send(dispatch) }
    )
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
    var playerIndex = state.nextPlayerIndex
    buildDispatch(state, function (dispatch) {
      dispatcher.sendDispatch(dispatch, extractDecision(callback, playerIndex))
    })
  }

  infoHider.sendError = function (error) {
    process.nextTick(function () {
      dispatcher.sendError(error)
    })
  }

  return infoHider
}