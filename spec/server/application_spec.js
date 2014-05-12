describe("the application", function () {
  "use strict";

  var http = require("http")
  var helpers = require("../spec_helper")
  var applicationFactory = helpers.requireSource("server/application")

  var gameServer, webServer, port

  beforeEach(function () {
    gameServer = jasmine.createSpyObj("game server", ["start"])
    webServer = jasmine.createSpyObj("web server", ["listen", "close"])

    spyOn(http, "createServer").and.returnValue(webServer)

    port = 1
  })

  describe("starting", function () {
    it("should start declared game server and web server", function () {
      http.createServer.and.returnValue(null)

      var application = applicationFactory.build({
        gameServer: gameServer,
        webServer: webServer
      })

      application.start(port)

      expect(gameServer.start).toHaveBeenCalled()
      expect(webServer.listen).toHaveBeenCalledWith(port)
    })

    it("should start default servers if none are specified", function () {
      var gameServerFactory = helpers.requireSource("server/game_server")
      spyOn(gameServerFactory, "build").and.returnValue(gameServer)

      var application = applicationFactory.build()

      application.start(port)

      expect(gameServer.start).toHaveBeenCalled()
      expect(webServer.listen).toHaveBeenCalledWith(port)
    })

    it("should inject declared dependencies into defaults", function () {
      var router = helpers.dummy()

      var application = applicationFactory.build({
        router: router
      })

      application.start(port)

      expect(http.createServer).toHaveBeenCalledWith(router)
    })

    it("should not initialize default dependencies more than once", function () {
      var dispatcherFactory = helpers.requireSource("server/dispatcher")
      spyOn(dispatcherFactory, "build").and.callThrough()
      
      var application = applicationFactory.build()
      application.start(port)

      expect(dispatcherFactory.build.calls.count()).toBe(1)
    })
  })

  describe("stopping", function () {
    it("should close the web server", function () {
      var application = applicationFactory.build()

      application.stop()

      expect(webServer.close).toHaveBeenCalled()
    })
  })
})