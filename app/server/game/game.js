"use strict";

var async = require("async")
var depdep = require("depdep")

var defaults = {
  stateManager: function () {},
  agents: function () {},
  startState: function () {}
}

exports.build = function (substitutions) {
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