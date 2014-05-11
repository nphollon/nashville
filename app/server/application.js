"use strict";

var defaults = {
  webServer: {
    dependencies: ["router"],
    factory: function (deps) {
      return require("http").createServer(deps.router)
    }
  },

  router: {
    dependencies: ["routes"],
    factory: function (deps) {
      return require("./router").build(deps.routes)
    }
  },

  routes: {
    dependencies: ["routeFactory", "adapter"],
    factory: function (deps) {
      var get = deps.routeFactory.get
      var post = deps.routeFactory.post
      return {
        "/": get("public/index.html", "text/html"),
        "/index.css": get("public/index.css", "text/css"),
        "/index.js": get("public/index.js", "application/javascript"),
        "/request-update": post(deps.adapter.requestUpdate),
        "/submit-decision": post(deps.adapter.submitDecision)
      }
    }
  },

  routeFactory: {
    dependencies: [],
    factory: function () {
      return require("./routes")
    }
  },

  adapter: {
    dependencies: ["dispatcher"],
    factory: function (deps) {
      return require("./ajax_adapter").build(deps.dispatcher)
    }
  },

  dispatcher: {
    dependencies: [],
    factory: function () {
      return require("./dispatcher").build()
    }
  },

  gameServer: {
    dependencies: ["dispatcher", "stateManager", "chancePlayer"],
    factory: function (deps) {
      return require("./game_server").build(
        deps.dispatcher,
        deps.stateManager,
        deps.chancePlayer
      )
    }
  },

  stateManager: {
    dependencies: [],
    factory: function () {
      return require("./state_manager").build()
    }
  },

  chancePlayer: {
    dependencies: [],
    factory: function () {
      return null
    }
  }
}

exports.build = function (substitutions) {
  var application = {}

  var objects = {}

  var buildObject = function (name) {
    if (objects.hasOwnProperty(name)) {
      return
    }

    if (substitutions && substitutions.hasOwnProperty(name)) {
      objects[name] = substitutions[name]
      return
    }

    defaults[name].dependencies.forEach(buildObject)

    objects[name] = defaults[name].factory(objects)
  }

  Object.keys(defaults).forEach(buildObject)

  application.start = function (port) {
    objects.gameServer.start()
    objects.webServer.listen(port)
  }
  
  return application
}
