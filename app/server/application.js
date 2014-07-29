"use strict";

var defaultFactories = {
  webServer: function (that) {
    return require("http").createServer(that.router)
  },

  router: function (that) {
    return require("./web/router").build(that.routes)
  },

  routes: function (that) {
    var get = that.routeFactory.get
    var post = that.routeFactory.post
    return {
      "/": get("public/index.html", "text/html"),
      "/index.css": get("public/index.css", "text/css"),
      "/index.js": get("public/index.js", "application/javascript"),
      "/bootstrap.min.css": get("public/bootstrap.min.css", "text/css"),
      "/bootstrap.min.js": get("public/bootstrap.min.js", "application/javascript"),
      "/request-update": post(that.adapter.requestUpdate),
      "/submit-decision": post(that.adapter.submitDecision)
    }
  },

  routeFactory: function () {
    return require("./web/routes")
  },

  playerCount: function () {
    return 2
  },

  adapter: function (that) {
    return require("./web/ajax_adapter").build(that.splitter.input(0))
  },

  agents: function (that) {
    return [
      require("./game/default_opponent").build(that.splitter.input(1)),
      require("./game/chance_player").build(that.random, that.splitter.input(that.playerCount))
    ]
  },

  random: function () {
    var Random = require("random-js");
    return new Random(Random.engines.mt19937().autoSeed())
  },

  splitter: function (that) {
    return require("./web/splitter").build(
      that.dispatcher,
      that.playerCount + 1
    )
  },

  dispatcher: function () {
    return require("./web/dispatcher").build()
  },

  infoHider: function (that) {
    return require("./game/info_hider").build(
      that.dispatcher,
      that.playerCount + 1
    )
  },

  gameDriver: function (that) {
    var sm = require("./game/state_manager")
    return sm.build(that.infoHider, sm.mutateState)
  },

  startState: function (that) {
    return require("./game/states").build(that.playerCount)
  }
}

exports.build = function (substitutions) {
  var application = {}

  var context = require("depdep").buildContext(defaultFactories, substitutions)

  Object.defineProperty(application, "context", {
    value: context
  })
  
  application.start = function (port) {
    context.gameDriver.start(context.startState)
    context.agents.forEach(function (agent) {
      agent.start()
    })
    context.webServer.listen(port)
  }

  application.stop = function () {
    context.webServer.close()
  }
  
  return application
}
