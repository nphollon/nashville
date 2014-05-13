describe("the application", function () {
  "use strict";

  var dependencyManager = require("depdep")
  
  var helpers = require("../spec_helper")
  var applicationFactory = helpers.requireSource("server/application")

  var gameServer, webServer, port, expectedSubs

  beforeEach(function () {
    port = 1
    gameServer = jasmine.createSpyObj("game server", ["start"])
    webServer = jasmine.createSpyObj("web server", ["listen", "close"])
    expectedSubs = helpers.dummy()

    var context = { gameServer: gameServer, webServer: webServer }

    spyOn(dependencyManager, "buildApplicationContext").and.callFake(
      function (defaultContext, subs) {
        return (subs === expectedSubs) ? context : undefined
      }
    )
  })

  describe("starting", function () {
    it("should start servers received from dependency manager", function () {
      var application = applicationFactory.build(expectedSubs)

      application.start(port)

      expect(gameServer.start).toHaveBeenCalled()
      expect(webServer.listen).toHaveBeenCalledWith(port)
    })
  })

  describe("stopping", function () {
    it("should close the web server", function () {
      var application = applicationFactory.build(expectedSubs)

      application.stop()

      expect(webServer.close).toHaveBeenCalled()
    })
  })
})