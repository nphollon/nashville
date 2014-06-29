describe("The client", function () {
	"use strict";
	
	var helpers = require("../spec_helper")
	var mock = jasmine.createSpyObj
	var dummy = helpers.dummy
	var clientFactory = helpers.requireSource("client/client")

	var requester, renderer, reader, client

	beforeEach(function () {
		spyOn(console, "log")
		requester = mock("requester", ["request", "submit"])
		renderer = mock("renderer", ["render", "error"])
		reader = mock("reader", ["disable", "enable"])
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
			client.update(null, response)
			expect(renderer.render).toHaveBeenCalledWith(response)
		})

		it("enables user input if the response asks for user input", function () {
			client.update(null, createResponse(true))
			expect(reader.enable).toHaveBeenCalledWith(client.submit)
		})

		it("does not send a request if the response asks for user input", function () {
			spyOn(process, "nextTick")
			client.update(null, createResponse(true))
			expect(process.nextTick).not.toHaveBeenCalled()
		})

		it("displays the info if the response forbids user input", function () {
			var response = createResponse(false)
			client.update(null, response)
			expect(renderer.render).toHaveBeenCalledWith(response)
		})

		it("does not enable user input if the response forbids it", function () {
			client.update(null, createResponse(false))
			expect(reader.enable).not.toHaveBeenCalled()
		})

		it("submits an empty decision if the response forbids user input", function (done) {
			requester.submit.and.callFake(function (decision, callback) {
				expect(decision).toEqual({})
				expect(callback).toEqual(client.update)
				done()
			})
			client.update(null, createResponse(false))
		})

		it("logs the error if it receives one", function (done) {
			var error = dummy()

			console.log.and.callFake(function (data) {
				expect(data).toBe(error)
				done()
			})

			client.update(error)
		})

		it("displays error message if one is received", function () {
			var error = dummy()

			client.update(error)

			expect(renderer.error).toHaveBeenCalled()
		})
	})

	describe("submitting user input", function () {
		it("sends the submission as a request", function (done) {
			var decision = dummy()
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
		return {
			input: { enableSubmit: enableInput }
		}
	}
})
