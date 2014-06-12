describe("the application", function () {
  "use strict";
  
  var helpers = require("../spec_helper")
  var applicationFactory = helpers.requireSource("server/application")

  var gameDriver, webServer, port, playerCount, substitutions

  beforeEach(function () {
    port = 1
    gameDriver = jasmine.createSpyObj("game driver", ["start"])
    webServer = jasmine.createSpyObj("web server", ["listen", "close"])
    playerCount = 3

    substitutions = { gameDriver: gameDriver, webServer: webServer, playerCount: playerCount }
  })

  it("should pass substitutions to dependency manager", function () {
    var dependencyManager = require("depdep")
    spyOn(dependencyManager, "buildContext")
    applicationFactory.build(substitutions)
    expect(dependencyManager.buildContext).toHaveBeenCalledWith(jasmine.any(Object), substitutions)
  })

  it("should start web server and game driver", function () {
    var application = applicationFactory.build(substitutions)

    application.start(port)

    expect(gameDriver.start).toHaveBeenCalledWith(playerCount)
    expect(webServer.listen).toHaveBeenCalledWith(port)
  })

  it("should close the web server when stopped", function () {
    var application = applicationFactory.build(substitutions)

    application.stop()

    expect(webServer.close).toHaveBeenCalled()
  })
})