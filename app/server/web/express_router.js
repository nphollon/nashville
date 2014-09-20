"use strict";

var express = require("express")
var bodyParser = require("body-parser")
var cookieParser = require("cookie-parser")
var events = require("../game/events")

var complete = function (response) {
  return function (error, update) {
    if (error === null) {
      response.json(update)
    } else {
      response.status(422).json(error)
    }
  }
}

exports.build = function (sessionManager) {
  var app = express()

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(cookieParser())

  app.get("/", function (request, response) {
    response.sendfile("public/index.html")
  })

  app.get("/public/:file", function (request, response) {
    response.sendfile("public/" + request.params.file)
  })

  app.post("/request-update", function (request, response) {
    var dispatcher = sessionManager.lookup(request)
    dispatcher.requestUpdate(complete(response))
  })

  app.post("/submit-decision", function (request, response) {
    var decision = events.playerEvent(request.body)
    var dispatcher = sessionManager.lookup(request)
    dispatcher.submitDecision(decision, complete(response))
  })

  return app
}