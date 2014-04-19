"use strict"

var testContext

;(function () {
	var fs = require("fs")
	var vm = require("vm")

	testContext = {}

	var testFileText = fs.readFileSync("app/public/javascripts/client.js")
	vm.runInNewContext(testFileText, testContext)
})()

describe("The client", function () {
	var requester, renderer, reader, client

	beforeEach(function () {
		requester = createMock(["request", "submit"])
		renderer = createMock(["render"])
		reader = createMock(["disable", "enable"])
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
			var decision = {}
			client.submit(decision)
			expect(requester.submit).toHaveBeenCalledWith(decision, client.update)
		})

		it("disables user input", function () {
			var decision = {}
			client.submit(decision)
			expect(reader.disable).toHaveBeenCalled()
		})
	})

	var createMock = function (stubMethods) {
		var mock = {}
		stubMethods.forEach(function (stubMethod) {
			mock[stubMethod] = function () {}
			spyOn(mock, stubMethod)
		})
		return mock
	}

	var createResponse = function (enableInput) {
		return { enableInput: enableInput }
	}
})

describe("The requester", function () {
	beforeEach(function () {
		// $ = mock
		// urls = {reque}
		// requester = new Requester($)
	})

	describe("requesting data", function () {
		// callback = {}
		// requester.request(callback)
		// verify($).get()
	})
})

/**
requester
	request(callback)
	submit(data, callback)

reader
	enable(callback)
	disable()

renderer
	render(data)
**/