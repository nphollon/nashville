"use strict";

exports.build = function (random, newGame) {
  var sessionManager = {}

  var sessions = Object.create(null)

  var newSession = function (response) {
    var id = random.uuid4()
    sessions[id] = newGame()

    response.cookie("session", id)
    return sessions[id].splitter.input(0)
  }

  sessionManager.lookup = function (request, response) {
    var id = request.cookies.session

    if (sessions[id] === undefined) {
      return newSession(response)
    }

    return sessions[id].splitter.input(0)
  }

  return sessionManager
}