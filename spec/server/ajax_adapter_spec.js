describe("Ajax adapter", function () {
  "use strict";

  var helpers = require("../spec_helper")
  var dummy = helpers.dummy
  var adapterFactory = helpers.requireSource("server/ajax_adapter")
  var events = helpers.requireSource("server/game_events")
  var adapter, dispatcher

  beforeEach(function () {
    dispatcher = dummy()
    adapter = adapterFactory.build(dispatcher)
  })

  it("should forward update requests to dispatcher", function (done) {
    var clientCallback = dummy()

    dispatcher.requestUpdate = function (receivedCallback) {
      expect(receivedCallback).toBe(clientCallback)
      done()
    }

    adapter.requestUpdate({}, clientCallback)
  })

  it("should transform decisions to player events and send to dispatcher", function (done) {
    var clientCallback = dummy()
    var jsonDecision = { wager: 3 }

    dispatcher.submitDecision = function (playerEvent, receivedCallback) {
      expect(receivedCallback).toBe(clientCallback)
      expect(playerEvent.wager).toBe(3)
      expect(playerEvent.type).toBe(events.playerType)
      done()
    }

    adapter.submitDecision(jsonDecision, clientCallback)
  })
})