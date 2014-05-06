describe("The referee", function () {
  "use strict";

  var helpers = require("./spec_helper")
  var dummy = helpers.dummy
  var mock = helpers.mock
  var refereeFactory = helpers.requireSource("server/referee")

  var referee, dispatcher

  beforeEach(function () {
    dispatcher = mock(["sendDispatch"])
    referee = refereeFactory.buildReferee(dispatcher)
  })

  it("should not contact dispatcher until told to start", function () {
    expect(dispatcher.sendDispatch).not.toHaveBeenCalled()
  })

  it("should send an update to the dispatcher when it starts", function (done) {
    var newGame = dummy()

    referee.start(newGame)

    process.nextTick(function () {
      expect(dispatcher.sendDispatch).toHaveBeenCalledWith(newGame, referee.updateGame)
      done()
    })
  })

  it("should...")
})

