"use strict";

var defaultDependencies = {
  webServer: function () {
    return require("http").createServer(
      this.router()
    )
  },

  router: function () {
    return require("./router").build(
      this.routes()
    )
  },

  routes: function () {
    var routeFactory = this.routeFactory()
    var adapter = this.adapter()
    return {
      "/": routeFactory.get("public/index.html", "text/html"),
      "/index.css": routeFactory.get("public/index.css", "text/css"),
      "/index.js": routeFactory.get("public/index.js", "application/javascript"),
      "/request-update": routeFactory.post(adapter.requestUpdate),
      "/submit-decision": routeFactory.post(adapter.submitDecision)
    }
  },

  routeFactory: function () {
    return require("./routes")
  },

  adapter: function () {
    return require("./ajax_adapter").build(
      this.dispatcher()
    )
  },

  dispatcher: function () {
    return require("./dispatcher").build()
  },

  gameServer: function () {
    return require("./referee").build(
      this.dispatcher(),
      this.stateManager(),
      this.chancePlayer()
    )
  },

  stateManager: function () {
    return require("./state_manager").build()
  },

  chancePlayer: function () {
    return null
  }
}

var replaceDependencies = function (dependencies, substitutions) {
  Object.keys(substitutions).forEach(function (key) {
    dependencies[key] = function () {
      return substitutions[key]
    }
  }, dependencies)
}

exports.build = function (substitutions) {
  var application = {}

  var dependencies = Object.create(defaultDependencies)

  if (substitutions !== undefined) {
    replaceDependencies(dependencies, substitutions)
  }

  application.start = function (port) {
    dependencies.gameServer().start()
    dependencies.webServer().listen(port)
  }
  
  return application
}
