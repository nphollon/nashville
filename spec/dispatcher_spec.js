;(function () {
	"use strict";
  /*
	Valid states for the dispatcher:
	0) DISPATCHER has NOTHING
	A) DISPATCHER has a DISPATCH and an unfulfilled REFEREE CALLBACK
	B) DISPATCHER has an unfulfilled REQUEST CALLBACK
	C) DISPATCHER has a DECISION and an unfulfilled REQUEST CALLBACK
  */

  var helpers = require("./spec_helper")
  var dummy = helpers.dummy
	var dispatcherFactory = helpers.requireSource("server/dispatcher")

	describe("The dispatcher", function () {
		var dispatcher
		
		beforeEach(function () {
			dispatcher = dispatcherFactory.buildDispatcher()
		})

		/*
		I) The CLIENT sends REQUEST CALLBACK
			0) DISPATCHER stores the REQUEST CALLBACK, enters state B
			A) DISPATCHER sends the DISPATCH to the REQUEST CALLBACK, remains in state A
			B) DISPATCHER replaces the REQUEST CALLBACK, remains in state B
			C) DISPATCHER replaces the REQUEST CALLBACK, keeps the DECISION, enters state B
		*/
		describe("Requesting an update", function () {
			
			it("should send dispatch to callback if dispatch exists", function (done) {
				var dispatch = dummy()
				dispatcher.sendDispatch(dispatch)

				dispatcher.requestUpdate(function (error, data) {
					expect(error).toBe(null)
					expect(data).toBe(dispatch)
					done()
				})
			})

			it("should not call the callback if dispatch does not exist", function (done) {
				var callback = jasmine.createSpy("client callback")
				dispatcher.requestUpdate(callback)

				process.nextTick(function () {
					expect(callback).not.toHaveBeenCalled()
					done()
				})
			})
		})

		/*
		II) The CLIENT sends DECISION and REQUEST CALLBACK
			0) DISPATCHER stores the DECISION CALLBACK, enters state C
			1) DISPATCHER sends the DECISION to the REFEREE CALLBACK, discards the DISPATCH, enters state B
			2) DISPATCHER sends an ERROR to the new REQUEST CALLBACK 
			3) DISPATCHER sends an ERROR to the new REQUEST CALLBACK
		*/

		describe("submitting a decision", function () {
		})
		
		/*
		III) The REFEREE sends a DISPATCH whenever it updates the game state
			0) DISPATCHER stores the DISPATCH and REFEREE CALLBACK, enters state A
			A) DISPATCHER replaces DISPATCH and REFEREE CALLBACK, remains in state A
			B) DISPATCHER sends DISPATCH to REQUEST CALLBACK, stores DISPATCH and REFEREE CALLBACK, enters state A
			C) DISPATCHER sends DECISION to REFEREE CALLBACK, discards the DISPATCH, enters state B
		*/
		describe("sending a dispatch", function () {
		})
	})
})()
