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

  adapter: function (that) {
    return require("./web/ajax_adapter").build(that.firstPlayerEntry)
  },

  playerCount: function () {
    return 1
  },

  firstPlayerEntry: function (that) {
    return {
      submitDecision: that.splitter.submitDecision(0),
      requestUpdate: that.splitter.requestUpdate(0)
    }
  },

  splitter: function (that) {
    return require("./web/splitter").build(
      that.dispatcher,
      that.playerCount
    )
  },

  dispatcher: function () {
    return require("./web/dispatcher").build()
  },

  infoHider: function (that) {
    return require("./game/info_hider").build(
      that.dispatcher,
      that.playerCount
    )
  },

  gameDriver: function (that) {
    return require("./game/driver").build(
      that.infoHider,
      that.stateManager,
      that.chancePlayer
    )
  },

  stateManager: function (that) {
    return require("./game/state_manager").build(that.playerCount)
  },

  chancePlayer: function (that) {
    return require("./game/chance_player").build(that.random)
  },

  random: function () {
    var Random = require("random-js");
    return new Random(Random.engines.mt19937().autoSeed())
  }
}

exports.build = function (substitutions) {
  var application = {}

  Object.defineProperty(application, "context", {
    value: require("depdep").buildContext(defaultFactories, substitutions)
  })
  
  application.start = function (port) {
    this.context.gameDriver.start(this.context.playerCount)
    this.context.webServer.listen(port)
  }

  application.stop = function () {
    this.context.webServer.close()
  }
  
  return application
}
