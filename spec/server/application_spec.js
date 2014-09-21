describe("the application", function () {
  "use strict";

  var helpers = require("../spec_helper")
  var applicationFactory = helpers.requireSource("server/application")
  var webServer, port, substitutions

  beforeEach(function () {
    port = 1
    webServer = jasmine.createSpyObj("web server", ["listen", "close"])

    substitutions = {
      webServer: webServer
    }
  })

  it("should pass substitutions to dependency manager", function () {
    var dependencyManager = require("depdep")
    spyOn(dependencyManager, "buildLazyContext")

    applicationFactory.build(substitutions)

    expect(dependencyManager.buildLazyContext).toHaveBeenCalledWith(jasmine.any(Object), substitutions)
  })

  it("should start web server", function () {
    var application = applicationFactory.build(substitutions)

    application.start(port)

    expect(webServer.listen).toHaveBeenCalledWith(port)
  })

  it("should close the web server when stopped", function () {
    var application = applicationFactory.build(substitutions)

    application.stop()

    expect(webServer.close).toHaveBeenCalled()
  })
})