describe("Ajax adapter", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var dummy = helpers.dummy
  var adapterFactory = helpers.requireSource("server/web/ajax_adapter")
  var adapter, dispatcher

  beforeEach(function () {
    dispatcher = dummy()
    adapter = adapterFactory.build(dispatcher)
  })

  it("should stringify dispatcher responses when client requests update", function (done) {
    var serverResponse = { key: "value" }

    var clientCallback = function (error, data) {
      expect(error).toBe(null)
      expect(data).toBe(JSON.stringify(serverResponse))
      done()
    }

    dispatcher.requestUpdate = function (callback) {
      callback(null, serverResponse)
    }

    adapter.requestUpdate("{}", clientCallback)
  })

  it("should send player decision to dispatcher", function (done) {
    var jsonDecision = JSON.stringify({ wager: 3 })

    dispatcher.submitDecision = function (playerEvent) {
      expect(playerEvent.wager).toBe(3)
      done()
    }

    adapter.submitDecision(jsonDecision, dummy())
  })

  it("should stringify dispatcher responses when client submits decision", function (done) {
    var serverResponse = { key: "value" }

    var clientCallback = function (error, data) {
      expect(error).toBe(null)
      expect(data).toBe(JSON.stringify(serverResponse))
      done()
    }

    dispatcher.submitDecision = function (playerEvent, callback) {
      callback(null, serverResponse)
    }

    adapter.submitDecision("{}", clientCallback)
  })

  it("should cast dispatcher errors to JSON", function (done) {
    var dispatcherError = new Error("dispatcher error")

    var forwardedError = {
      status: dispatcherError.message
    }

    var clientCallback = function (error) {
      expect(error).toBe(JSON.stringify(forwardedError))
      done()
    }

    dispatcher.requestUpdate = function (callback) {
      callback(dispatcherError)
    }

    adapter.requestUpdate("{}", clientCallback)
  })
})