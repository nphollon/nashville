describe("The dispatcher", function () {
  "use strict";
  
  var helpers = require("../../spec_helper")
  var dummy = helpers.dummy
  var dispatcherFactory = helpers.requireSource("server/game/dispatcher")

	var dispatcher

  var submitErrorMessage = "Game server received unexpected client submission."
	
	beforeEach(function () {
		dispatcher = dispatcherFactory.build()
	})

  it("should wait for first dispatch if a request is received before server is ready", function (done) {
    var dispatch = dummy()
    var requestCallback = function (error, data) {
      expect(error).toBe(null)
      expect(data).toBe(dispatch)
      done()
    }

    dispatcher.requestUpdate(requestCallback)
    
    process.nextTick(function () {
      dispatcher.sendDispatch(dispatch, dummy())
    })
  })

  it("should send an error if a submission is received before a dispatch", function (done) {
    var submitCallback = function (error) {
      expect(error.message).toBe(submitErrorMessage)
      done()
    }

    dispatcher.submitDecision(dummy(), submitCallback)
  })

  it("should fulfill an update request with the last dispatch from the server", function (done) {
    var dispatch = dummy()

    var requestCallback = function (error, data) {
      expect(error).toBe(null)
      expect(data).toBe(dispatch)
      done()
    }

    dispatcher.sendDispatch(dispatch, dummy())
    dispatcher.requestUpdate(requestCallback)
  })

  it("should fulfill the server callback when the client submits a decision", function (done) {
    var decision = dummy()

    var serverCallback = function (error, data) {
      expect(error).toBe(null)
      expect(data).toBe(decision)
      done()
    }

    dispatcher.sendDispatch(dummy(), serverCallback)
    dispatcher.submitDecision(decision, dummy())
  })

  it("should fulfill the submit callback with the next dispatch from the server", function (done) {
    var dispatch = dummy()

    var serverCallback = function () {
      process.nextTick(function () {
        dispatcher.sendDispatch(dispatch, dummy())
      })
    }

    var submitCallback = function (error, data) {
      expect(error).toBe(null)
      expect(data).toBe(dispatch)
      done()
    }

    dispatcher.sendDispatch(dummy(), serverCallback)
    dispatcher.submitDecision(dummy(), submitCallback)
  })

  it("should not fulfill a submit callback more than once", function (done) {
    var sendDispatch = dispatcher.sendDispatch.bind(dispatcher, dummy(), dummy())    
    sendDispatch()

    var submitCallback = jasmine.createSpy("submit callback")
    dispatcher.submitDecision(dummy(), submitCallback)

    var dispatchInterval = setInterval(sendDispatch, 1, dummy(), dummy())

    helpers.later(function () {
      clearInterval(dispatchInterval)
      expect(submitCallback.calls.count()).toBe(1)
      done()
    })
  })

  it("should send an error if a decision is submitted before previous submit callback is fulfilled", function (done) {
    var submitCallback = function (error) {
      expect(error.message).toBe(submitErrorMessage)
      done()
    }

    dispatcher.sendDispatch(dummy(), dummy())
    dispatcher.submitDecision(dummy(), dummy())

    process.nextTick(function () {
      dispatcher.submitDecision(dummy(), submitCallback)
    })
  })

  it("should fulfill first submit callback if more than was received", function (done) {
    var dispatch = dummy()

    var firstSubmitCallback = function (error, data) {
      expect(error).toBe(null)
      expect(data).toBe(dispatch)
      done()
    }

    var secondSubmitCallback = function () {
      dispatcher.sendDispatch(dispatch, dummy())
    }

    dispatcher.sendDispatch(dummy(), dummy())
    dispatcher.submitDecision(dummy(), firstSubmitCallback)

    process.nextTick(function () {
      dispatcher.submitDecision(dummy(), secondSubmitCallback)
    })
  })

  it("should forward server error to submit callback", function (done) {
    var expectedError = dummy()

    var submitCallback = function (error) {
      expect(error).toBe(expectedError)
      done()
    }

    dispatcher.sendDispatch(dummy(), dummy())
    dispatcher.submitDecision(dummy(), submitCallback)

    process.nextTick(function () {
      dispatcher.sendError(expectedError)
    })
  })
})
