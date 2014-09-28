"use strict";

var async = require("async")
var depdep = require("depdep")

var defaults = {
  agents: function (that) {
    return require("./player_factory").buildList(that.splitter, that.deciders)
  },

  deciders: function (that) {
    return [null, that.opponent, that.chancePlayer]
  },

  opponent: function () {
    return require("./opponents").martingaleDecider()
  },

  chancePlayer: function (that) {
    return require("./chance_player").decider(that.random)
  },

  splitter: function (that) {
    return require("./splitter").build(
      that.dispatcher,
      that.playerCount + 1
    )
  },

  stateManager: function (that) {
    var sm = require("./state_manager")
    return sm.build(that.infoHider, sm.mutateState)
  },

  infoHider: function (that) {
    return require("./info_hider").build(
      that.dispatcher,
      that.toResponse,
      that.playerCount + 1
    )
  },

  dispatcher: function () {
    return require("./dispatcher").build()
  },

  toResponse: function () {
    return require("./response")
  },

  startState: function (that) {
    return require("./states").build(that.playerCount)
  },

  random: function () {
    var Random = require("random-js");
    return new Random(Random.engines.mt19937().autoSeed())
  },

  playerCount: function () {
    return 2
  }
}

exports.build = function (substitutions) {
  return function () {
    var context = depdep.buildLazyContext(defaults, substitutions)

    context.stateManager.start(context.startState)
      
    async.each(
      context.agents,
      function (agent, done) {
        agent.start()
        done()
      }
    )

    return context
  }
}