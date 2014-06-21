describe("The splitter", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var dummy = helpers.dummy
  var splitterFactory = helpers.requireSource("server/web/splitter")

  var splitter, dispatcher

  describe("with one player", function () {
    var decision, response

    beforeEach(function () {
      dispatcher = {}
      decision = dummy()
      response = dummy()
      splitter = splitterFactory.build(dispatcher, 1)
    })

    it("should forward decisions and dispatches immediately on player submission", function (done) {
      dispatcher.submitDecision = function (decisionList, callback) {
        expect(decisionList).toEqual([decision])
        callback(null, [response])
      }

      var playerCallback = function (error, data) {
        expect(error).toBe(null)
        expect(data).toBe(response)
        done()
      }

      splitter.input(0).submitDecision(decision, playerCallback)
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

      splitter.input(0).submitDecision(decision, playerCallback)
    })

    it("should forward dispatch immediately on player request", function (done) {
      dispatcher.requestUpdate = function (callback) {
        callback(null, [response])
      }

      var playerCallback = function (error, data) {
        expect(error).toBe(null)
        expect(data).toBe(response)
        done()
      }

      splitter.input(0).requestUpdate(playerCallback)
    })

    it("should forward error immediately on player request", function (done) {
      var dispatcherError = dummy()
      dispatcher.requestUpdate = function (callback) {
        callback(dispatcherError)
      }

      var playerCallback = function (error) {
        expect(error).toBe(dispatcherError)
        done()
      }

      splitter.input(0).requestUpdate(playerCallback)
    })
  })

  describe("with two players", function () {
    var decisions, responses

    beforeEach(function () {
      decisions = [ dummy(), dummy() ]
      responses = [ dummy(), dummy() ]
      dispatcher = {}
      splitter = splitterFactory.build(dispatcher, 2)
    })

    it("should forward decisions after both players have submitted", function (done) {
      dispatcher.submitDecision = function (decisionList) {
        expect(decisionList).toEqual(decisions)
        done()
      }

      splitter.input(0).submitDecision(decisions[0], dummy())
      splitter.input(1).submitDecision(decisions[1], dummy())
    })

    it("should allow players to submit in either order", function (done) {
      dispatcher.submitDecision = function (decisionList) {
        expect(decisionList).toEqual(decisions)
        done()
      }

      splitter.input(1).submitDecision(decisions[1], dummy())
      splitter.input(0).submitDecision(decisions[0], dummy())
    })

    it("should fulfill callback for player 1", function (done) {
      dispatcher.submitDecision = function (decisionList, callback) {
        callback(null, responses)
      }

      var playerCallback = function (error, data) {
        expect(error).toBe(null)
        expect(data).toBe(responses[0])
        done()
      }

      splitter.input(0).submitDecision(decisions[0], playerCallback)
      splitter.input(1).submitDecision(decisions[1], dummy())
    })

    it("should fulfill callback for player 2", function (done) {
      dispatcher.submitDecision = function (decisionList, callback) {
        callback(null, responses)
      }

      var playerCallback = function (error, data) {
        expect(error).toBe(null)
        expect(data).toBe(responses[1])
        done()
      }

      splitter.input(0).submitDecision(decisions[0], dummy())
      splitter.input(1).submitDecision(decisions[1], playerCallback)
    })

    it("should delete decisions after they are used", function (done) {
      dispatcher.submitDecision = function (decisionList, callback) {
        callback(null, responses)
      }

      splitter.input(0).submitDecision(dummy(), dummy())
      splitter.input(1).submitDecision(dummy(), function () {

        dispatcher.submitDecision = function (decisionList) {
          expect(decisionList).toEqual(decisions)
          done()
        }

        splitter.input(0).submitDecision(decisions[0], dummy())
        splitter.input(1).submitDecision(decisions[1], dummy())        
      })
    })

    it("should delete callbacks after they are used", function (done) {
      dispatcher.submitDecision = function (decisionList, callback) {
        callback(null, responses)
      }

      splitter.input(0).submitDecision(dummy(), dummy())
      splitter.input(1).submitDecision(dummy(), function () {

        splitter.input(0).submitDecision(decisions[0], dummy())
        splitter.input(1).submitDecision(decisions[1], function (error, data) {

          expect(error).toBe(null)
          expect(data).toBe(responses[1])
          done()
        })        
      })
    })

    it("should return error if player submits decision before last callback fulfilled", function (done) {
      splitter.input(0).submitDecision(dummy(), dummy())
      splitter.input(0).submitDecision(dummy(), function (error) {
        expect(error.message).toBe("Client submitted decision while waiting for an update")
        done()
      })
    })
  })
})
