describe("the application", function () {
  "use strict";

  var helpers = require("../spec_helper")
  var applicationFactory = helpers.requireSource("server/application")

  var gameServer, webServer, port

  beforeEach(function () {
    gameServer = jasmine.createSpyObj("game server", ["start"])
    webServer = jasmine.createSpyObj("web server", ["listen"])
    port = 1
  })

  describe("starting", function () {
    it("should start declared game server and web server", function () {
      var application = applicationFactory.build({
        gameServer: gameServer,
        webServer: webServer
      })

      application.start(port)

      expect(gameServer.start).toHaveBeenCalled()
      expect(webServer.listen).toHaveBeenCalledWith(port)
    })

    it("should start default servers if none are specified", function () {
      var http = require("http")
      var gameServerFactory = helpers.requireSource("server/game_server")

      spyOn(http, "createServer").and.returnValue(webServer)
      spyOn(gameServerFactory, "build").and.returnValue(gameServer)

      var application = applicationFactory.build()

      application.start(port)

      expect(gameServer.start).toHaveBeenCalled()
      expect(webServer.listen).toHaveBeenCalledWith(port)
    })

    it("should inject declared dependencies into defaults", function () {
      var router = helpers.dummy()
      var http = require("http")
      spyOn(http, "createServer").and.returnValue(webServer)

      var application = applicationFactory.build({
        gameServer: gameServer,
        router: router
      })

      application.start(port)

      expect(http.createServer).toHaveBeenCalledWith(router)
    })
  })
})