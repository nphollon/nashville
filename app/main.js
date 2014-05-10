;(function () {
	"use strict";

  var events = require("./server/game_events")

  var chancePlayer = {
    getNextEvent: function () {
      return events.chanceEvent(true)
    }
  }

  var dispatcherFactory = require("./server/dispatcher")
  var stateManagerFactory = require("./server/state_manager")
  var refereeFactory = require("./server/referee")
  var adapterFactory = require("./server/ajax_adapter")
  var routeFactory = require("./server/routes")
  var routerFactory = require("./server/router")
  var server = require("./server/server")

  var dispatcher = dispatcherFactory.build()

  var stateManager = stateManagerFactory.build()

  var referee = refereeFactory.build(dispatcher, stateManager, chancePlayer)

  var adapter = adapterFactory.build(dispatcher)

  var routes = {
    "/": routeFactory.get("public/index.html", "text/html"),
    "/index.css": routeFactory.get("public/index.css", "text/css"),
    "/index.js": routeFactory.get("public/index.js", "application/javascript"),
    "/request-update": routeFactory.post(adapter.requestUpdate),
    "/submit-decision": routeFactory.post(adapter.submitDecision)
  }

  var router = routerFactory.build(routes)
  
	var port = 4567

  referee.startGame()
	server.start(port, router)
	console.log("Server is listening on port " + port)
}())