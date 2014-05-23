describe("The splitter", function () {
  "use strict";

  var helpers = require("../spec_helper")
  var dummy = helpers.dummy
  var splitterFactory = helpers.requireSource("server/splitter")

  var splitter, dispatcher

  describe("with one player", function () {
    beforeEach(function () {
      dispatcher = {}
      splitter = splitterFactory.build(dispatcher, 1)
    })

    it("should forward decisions and dispatches immediately on player submission", function (done) {
      var decision = dummy()
      var response = dummy()

      dispatcher.submitDecision = function (decisionList, callback) {
        expect(decisionList).toEqual([decision])
        callback(null, [response])
      }

      var playerCallback = function (error, data) {
        expect(error).toBe(null)
        expect(data).toBe(response)
        done()
      }

      splitter.submitDecision(0)(decision, playerCallback)
    })

    it("should forward dispatcher error to callback on player submission", function (done) {
      var dispatcherError = dummy()

      dispatcher.submitDecision = function (decisionList, callback) {
        callback(dispatcherError)
      }

      var playerCallback = function (error) {
        expect(error).toBe(dispatcherError)
        done()
      }

      splitter.submitDecision(0)(dummy(), playerCallback)
    })

    it("should forward dispatch immediately on player request", function (done) {
      var response = dummy()

      dispatcher.requestUpdate = function (callback) {
        callback(null, [response])
      }

      var playerCallback = function (error, data) {
        expect(error).toBe(null)
        expect(data).toBe(response)
        done()
      }

      splitter.requestUpdate(0)(playerCallback)
    })
  })
})
