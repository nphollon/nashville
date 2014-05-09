describe("The client", function () {
	"use strict";
	
	var helpers = require("../spec_helper")
	var mock = helpers.mock
	var dummy = helpers.dummy
	var clientFactory = helpers.requireSource("client/client")

	var requester, renderer, reader, client

	beforeEach(function () {
		requester = mock(["request", "submit"])
		renderer = mock(["render"])
		reader = mock(["disable", "enable"])
		client = clientFactory.buildClient(requester, renderer, reader)
	})

	describe("starting", function () {
		it("sends a request", function (done) {
			client.start()
			requester.request.and.callFake(function (callback) {
				expect(callback).toBe(client.update)
				done()
			})
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
			spyOn(process, "nextTick")
			client.update(createResponse(true))
			expect(process.nextTick).not.toHaveBeenCalled()
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

		it("sends a request if the response forbids user input", function (done) {
			client.update(createResponse(false))
			requester.request.and.callFake(function (callback) {
				expect(callback).toBe(client.update)
				done()
			})
		})
	})

	describe("submitting user input", function () {
		it("sends the submission as a request", function (done) {
			var decision = dummy
			client.submit(decision)
			requester.submit.and.callFake(function (submission, callback) {
				expect(submission).toBe(decision)
				expect(callback).toBe(client.update)
				done()
			})
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
