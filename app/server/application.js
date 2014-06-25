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

  player2: function (that) {
    return require("./game/opponent").build(that.splitter.input(1))
  },

  chancePlayer: function (that) {
    return require("./game/chance_player").build(
      that.random,
      that.splitter.input(that.playerCount)
    )
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
    return require("./game/state_manager").build(that.infoHider)
  }
}

exports.build = function (substitutions) {
  var application = {}

  Object.defineProperty(application, "context", {
    value: require("depdep").buildContext(defaultFactories, substitutions)
  })
  
  application.start = function (port) {
    this.context.gameDriver.start(this.context.playerCount)
    this.context.player2.start()
    this.context.chancePlayer.start()
    this.context.webServer.listen(port)
  }

  application.stop = function () {
    this.context.webServer.close()
  }
  
  return application
}
