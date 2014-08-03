describe("The client", function () {
	"use strict";
	
	var helpers = require("../spec_helper")
	var clientFactory = helpers.requireSource("client/client")

	var mock = jasmine.createSpyObj
	var dummy = helpers.dummy
	var later = helpers.later

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
			requester.request = function (callback) {
				expect(callback).toBe(client.update)
				done()
			}

			client.start()
		})

		it("disables user input", function (done) {
			reader.disable = done
			client.start()
		})
	})

	describe("updating the user interface", function () {
		it("displays the info if the response asks for user input", function () {
			var response = createResponse(true)
			client.update(null, response)
			expect(renderer.render).toHaveBeenCalledWith(response)
		})

		it("enables user input if the response asks for user input", function () {
			var response = createResponse(true)
			client.update(null, response)
			expect(reader.enable).toHaveBeenCalledWith(response.input, client.submit)
		})

		it("does not send a request if the response asks for user input", function (done) {
			spyOn(process, "nextTick")
			client.update(null, createResponse(true))
			later(function () {
				expect(process.nextTick).not.toHaveBeenCalled()
				done()
			})
		})

		it("displays the info if the response forbids user input", function (done) {
			var response = createResponse(false)
			client.update(null, response)
			later(function () {
				expect(renderer.render).toHaveBeenCalledWith(response)
				done()
			})
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
			requester.submit = function (submission, callback) {
				expect(submission).toBe(decision)
				expect(callback).toBe(client.update)
				done()
			}

			client.submit(decision)
		})

		it("disables user input", function (done) {
			reader.disable = done
			client.submit(dummy())
		})
	})

	var createResponse = function (enableInput) {
		return {
			input: { enableSubmit: enableInput }
		}
	}
})
