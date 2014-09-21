describe("Game instance", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var gameFactory = helpers.requireSource("server/game/game")
  var later = helpers.later
  var dummy = helpers.dummy

  var stateManager, agent, startState, substitutions

  beforeEach(function () {
    stateManager = jasmine.createSpyObj("stateManager", ["start"])
    agent = jasmine.createSpyObj("agent", ["start"])
    startState = dummy()

    substitutions = {
      stateManager: stateManager,
      agents: [ agent ],
      startState: startState
    }
  })

  it("should pass substitutions to dependency manager", function () {
    var dummyContext = {
      stateManager: { start: dummy() },
      agents: []
    }

    var dependencyManager = require("depdep")
    spyOn(dependencyManager, "buildLazyContext").and.returnValue(dummyContext)

    var gameContext = gameFactory.build(substitutions)
    
    expect(gameContext).toBe(dummyContext)
    expect(dependencyManager.buildLazyContext).toHaveBeenCalledWith(jasmine.any(Object), substitutions)
  })

  it("should start the game driver and agents", function (done) {
    gameFactory.build(substitutions)

    later(function () {
      expect(stateManager.start).toHaveBeenCalledWith(startState)
      expect(agent.start).toHaveBeenCalled()
      done()
    })
  })
})