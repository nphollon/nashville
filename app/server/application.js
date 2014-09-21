"use strict";

var depdep = require("depdep")

var defaultFactories = {
  webServer: function (that) {
    return require("http").createServer(that.router)
  },

  router: function (that) {
    return require("./web/express_router").build(that.sessionManager)
  },

  sessionManager: function (that) {
    return require("./web/session_manager").build(that.random, that.gameFactory)
  },

  gameFactory: function (that) {
    return require("./game/game_factory").build(that.gameSubs)
  },

  gameSubs: function (that) {
    return { random: that.random }
  },

  random: function () {
    var Random = require("random-js");
    return new Random(Random.engines.mt19937().autoSeed())
  }
}

exports.build = function (substitutions) {
  var application = {}

  var context = depdep.buildLazyContext(defaultFactories, substitutions)
  Object.defineProperty(application, "context", { value: context })
  
  application.start = function (port) {
    context.webServer.listen(port)
  }

  application.stop = function () {
    context.webServer.close()
  }
  
  return application
}
