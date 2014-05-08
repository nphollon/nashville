describe("dependency manager", function () {
  "use strict";

  var proxyquire = require("proxyquire")

  var helpers = require("../spec_helper")
  var dummy = helpers.dummy
  var mock = helpers.mock
  var checkArgumentAndReturn = helpers.checkArgumentAndReturn

  var dependencyManagerFactory, depMock

  beforeEach(function () {
    depMock = mock(["build"])
    depMock["@noCallThru"] = true

    dependencyManagerFactory = proxyquire("../../app/client/dependencyManager", {
      "./dep": depMock
    })
  })

  it("should return specified dependency if it was passed in", function () {
    var dependencies = { dep: dummy() }
    var dependencyManager = dependencyManagerFactory.build(dependencies)

    expect(dependencyManager.get("dep")).toBe(dependencies.dep)
  })

  it("should build default object if specified dependency was not passed in", function () {
    var defaultDep = dummy()
    var dependencies = dummy()
    var dependencyManager = dependencyManagerFactory.build(dependencies)

    depMock.build.and.callFake(checkArgumentAndReturn(dependencies, defaultDep))

    expect(dependencyManager.get("dep")).toBe(defaultDep)
  })
})