describe("Game factory", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var gameFactoryFactory = helpers.requireSource("server/game/game_factory")
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

    var gameFactory = gameFactoryFactory.build(substitutions)
    var gameContext = gameFactory()
    
    expect(gameContext).toBe(dummyContext)
    expect(dependencyManager.buildLazyContext).toHaveBeenCalledWith(jasmine.any(Object), substitutions)
  })

  it("should start the game driver and agents", function (done) {
    gameFactoryFactory.build(substitutions)()

    later(function () {
      expect(stateManager.start).toHaveBeenCalledWith(startState)
      expect(agent.start).toHaveBeenCalled()
      done()
    })
  })

  it("should return a different context every time the factory is invoked", function () {
    var gameFactory = gameFactoryFactory.build(substitutions)
    
    var firstContext = gameFactory()
    var secondContext = gameFactory()

    expect(firstContext).not.toBe(secondContext)
  })
})