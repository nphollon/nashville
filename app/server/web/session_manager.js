"use strict";

exports.build = function (random, newGame) {
  var sessionManager = {}

  var sessions = Object.create(null)

  var newSession = function (response) {
    var id = random.uuid4()
    var game = newGame()
    sessions[id] = game

    response.cookie("session", id, { secure: true })
    return game
  }

  sessionManager.lookup = function (request, response) {
    var id = request.signedCookies.session

    if (sessions[id] === undefined) {
      return newSession(response)
    }

    return sessions[id]
  }

  return sessionManager
}