"use strict";

var async = require("async")
var depdep = require("depdep")

var defaultFactories = {
  webServer: function (that) {
    return require("http").createServer(that.router)
  },

  router: function (that) {
    return require("./web/express_router").build(that.splitter.input(0))
  },

  playerCount: function () {
    return 2
  },

  agents: function (that) {
    var playerFactory = require("./game/player_factory")
    var deciders = [null, that.opponent, that.chancePlayer]
    return playerFactory.buildList(that.splitter, deciders)
  },

  opponent: function () {
    return require("./game/opponents").martingaleDecider()
  },

  chancePlayer: function (that) {
    return require("./game/chance_player").decider(that.random)
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

  var context = depdep.buildContext(defaultFactories, substitutions)
  Object.defineProperty(application, "context", { value: context })
  
  application.start = function (port) {
    context.gameDriver.start(context.startState)
    
    async.each(
      context.agents,
      function (agent, done) {
        agent.start()
        done()
      },
      function () {
        context.webServer.listen(port)
      }
    )
  }

  application.stop = function () {
    context.webServer.close()
  }
  
  return application
}
