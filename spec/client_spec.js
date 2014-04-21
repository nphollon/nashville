"use strict"

var testContext, mock, dummy

;(function () {
	testContext = require("../app/client/client.js")
	
	var helpers = require("./spec_helper.js")
	mock = helpers.mock
	dummy = helpers.dummy
})()

describe("The client", function () {
	var requester, renderer, reader, client

	beforeEach(function () {
		requester = mock(["request", "submit"])
		renderer = mock(["render"])
		reader = mock(["disable", "enable"])
		client = testContext.buildClient(requester, renderer, reader)
	})

	describe("starting", function () {
		it("sends a request", function () {
			client.start()
			expect(requester.request).toHaveBeenCalledWith(client.update)
		})

		it("disables user input", function () {
			client.start()
			expect(reader.disable).toHaveBeenCalled()
		})
	})

	describe("updating the user interface", function () {
		it("displays the info if the response asks for user input", function () {
			var response = createResponse(true)
			client.update(response)
			expect(renderer.render).toHaveBeenCalledWith(response)
		})

		it("enables user input if the response asks for user input", function () {
			client.update(createResponse(true))
			expect(reader.enable).toHaveBeenCalledWith(client.submit)
		})

		it("does not send a request if the response asks for user input", function () {
			client.update(createResponse(true))
			expect(requester.request).not.toHaveBeenCalled()
		})

		it("displays the info if the response forbids user input", function () {
			var response = createResponse(false)
			client.update(response)
			expect(renderer.render).toHaveBeenCalledWith(response)
		})

		it("does not enable user input if the response forbids it", function () {
			client.update(createResponse(false))
			expect(reader.enable).not.toHaveBeenCalled()
		})

		it("sends a request if the response forbids user input", function () {
			client.update(createResponse(false))
			expect(requester.request).toHaveBeenCalledWith(client.update)
		})
	})

	describe("submitting user input", function () {
		it("sends the submission as a request", function () {
			var decision = dummy
			client.submit(decision)
			expect(requester.submit).toHaveBeenCalledWith(decision, client.update)
		})

		it("disables user input", function () {
			var decision = dummy()
			client.submit(decision)
			expect(reader.disable).toHaveBeenCalled()
		})
	})

	var createResponse = function (enableInput) {
		return { enableInput: enableInput }
	}
})

describe("The requester", function () {
	var jQuery, requestUrl, submitUrl, requester

	beforeEach(function () {
		jQuery = mock(["post"])
		requestUrl = "request url"
		submitUrl = "submit url"
		requester = testContext.buildRequester(jQuery, {
      requestUrl: requestUrl,
      submitUrl: submitUrl
    })
	})

	describe("requesting data", function () {
		it("posts an empty message to the request url", function () {
			var callback = dummy()
			requester.request(callback)
			expect(jQuery.post).toHaveBeenCalledWith(requestUrl, {}, callback)
		})
	})

	describe("submitting a decision", function () {
		it("posts the decision to the submit url", function () {
			var callback = dummy()
			var decision = dummy()
			requester.submit(decision, callback)
			expect(jQuery.post).toHaveBeenCalledWith(submitUrl, decision, callback)
		})
	})
})

describe("The reader", function () {
	var submitButton, wagerField, reader
	
	beforeEach(function () {
		submitButton = mock(["attr", "off", "click"])
    wagerField = mock(["val"])
		reader = testContext.buildReader({
      submitButton: submitButton,
      wagerField: wagerField
    })
	})

	describe("disabling user input", function () {
		it("should disable the submit button", function() {
			reader.disable()
			expect(submitButton.attr).toHaveBeenCalledWith("disabled", "true")
		})

		it("should remove the callback from the submit button", function() {
      reader.disable()
      expect(submitButton.off).toHaveBeenCalledWith("click")
		})
	})

  describe("enabling user input", function () {
    it("should enable the submit button", function () {
      reader.enable(dummy())
      expect(submitButton.attr).toHaveBeenCalledWith("disabled", "false")
    })

    it("should set the button's click event to trigger the callback", function () {
      var clientCallback = dummy()
      var callbackWrapper = dummy()

      spyOn(reader, "buildOnClickCallback").andCallFake(function (callback) {
        return (callback === clientCallback) ? callbackWrapper : undefined
      })

      reader.enable(clientCallback)

      expect(submitButton.click).toHaveBeenCalledWith(callbackWrapper)
    })
  })

  describe("building the onClick callback", function () {
    it("should not call the client callback", function () {
      var clientCallback = jasmine.createSpy("clientCallback")
      reader.buildOnClickCallback(clientCallback)
      expect(clientCallback).not.toHaveBeenCalled()
    })

    it("should return a function that sends the decision to the client callback", function () {
      var decision = dummy()
      spyOn(reader, 'getDecision').andReturn(decision)
      var clientCallback = jasmine.createSpy("clientCallback")

      var callbackWrapper = reader.buildOnClickCallback(clientCallback)

      callbackWrapper()
      expect(clientCallback).toHaveBeenCalledWith(decision)
    })
  })

  describe("getting the decision from the user interface", function () {
    it("should return the wager in the decision", function () {
      var wager = 7
      wagerField.val.andReturn(wager.toString())

      var decision = reader.getDecision()

      expect(decision.wager).toBe(wager)
    })
  })
})

describe("The renderer", function () {
  var wagerField, statusDiv, scoreDiv, renderer

  beforeEach(function () {
    wagerField = mock(["val"])
    statusDiv = mock(["text"])
    scoreDiv = mock(["text"])
    renderer = testContext.buildRenderer({
      statusDiv: statusDiv, 
      wagerField: wagerField,
      scoreDiv: scoreDiv
    })
  })

  describe("displaying the data", function () {
    it("should set the wager amount in the wager field", function () {
      var wager = 8
      renderer.render({ wager: wager })
      expect(wagerField.val).toHaveBeenCalledWith(wager)
    })

    it("should set the status message", function () {
      var message = "status message"
      renderer.render({ message: message })
      expect(statusDiv.text).toHaveBeenCalledWith(message)
    })

    it("should set the score", function () {
      var score = 0
      renderer.render({ score: score })
      expect(scoreDiv.text).toHaveBeenCalledWith(score)
    })
  })
})