"use strict";

var express = require("express")
var bodyParser = require("body-parser")
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

exports.build = function (dispatcher) {
  var app = express()

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.get("/", function (request, response) {
    response.sendfile("public/index.html")
  })

  app.get("/public/:file", function (request, response) {
    response.sendfile("public/" + request.params.file)
  })

  app.post("/request-update", function (request, response) {
    dispatcher.requestUpdate(complete(response))
  })

  app.post("/submit-decision", function (request, response) {
    var decision = events.playerEvent(request.body)
    dispatcher.submitDecision(decision, complete(response))
  })

  return app
}