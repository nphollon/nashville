describe("the application", function () {
  "use strict";
  
  var helpers = require("../spec_helper")
  var applicationFactory = helpers.requireSource("server/application")

  var later = helpers.later

  var gameDriver, webServer, port, startState, agent, substitutions

  beforeEach(function () {
    port = 1
    gameDriver = jasmine.createSpyObj("game driver", ["start"])
    webServer = jasmine.createSpyObj("web server", ["listen", "close"])
    agent = jasmine.createSpyObj("agent", ["start"])
    startState = helpers.dummy()

    substitutions = {
      gameDriver: gameDriver,
      webServer: webServer,
      agents: [ agent ],
      startState: startState
    }
  })

  it("should pass substitutions to dependency manager", function () {
    var dependencyManager = require("depdep")
    spyOn(dependencyManager, "buildLazyContext")
    applicationFactory.build(substitutions)
    expect(dependencyManager.buildLazyContext).toHaveBeenCalledWith(jasmine.any(Object), substitutions)
  })

  it("should start web server, game driver, and agents", function (done) {
    var application = applicationFactory.build(substitutions)

    application.start(port)

    later(function () {
      expect(gameDriver.start).toHaveBeenCalledWith(startState)
      expect(webServer.listen).toHaveBeenCalledWith(port)
      expect(agent.start).toHaveBeenCalled()
      done()
    })
  })

  it("should close the web server when stopped", function () {
    var application = applicationFactory.build(substitutions)

    application.stop()

    expect(webServer.close).toHaveBeenCalled()
  })
})