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

				var clientCallback = function (error, data) {
					expect(error).toBe(null)
					expect(data).toBe(dispatch)
					done()
				}

				dispatcher.sendDispatch(dispatch)

				process.nextTick(function () {
					dispatcher.requestUpdate(clientCallback)
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

			it("should replace previous client callback if one exists", function (done) {
				var decisionCallback = jasmine.createSpy("decision callback")
				var updateCallback = jasmine.createSpy("update callback")

				dispatcher.submitDecision(dummy(), decisionCallback)

				process.nextTick(function () {
					dispatcher.requestUpdate(dummy(), updateCallback)

					process.nextTick(function () {
						dispatcher.requestUpdate(dummy(), dummy())

						process.nextTick(function () {
							expect(decisionCallback).not.toHaveBeenCalled()
							expect(updateCallback).not.toHaveBeenCalled()
							done()
						})
					})
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
			it("should send decision to referee callback if callback exists", function (done) {
				var decision = dummy()

				var refereeCallback = function (error, data) {
					expect(error).toBe(null)
					expect(data).toBe(decision)
					done()
				}

				dispatcher.sendDispatch(dummy(), refereeCallback)

				process.nextTick(function () {
					dispatcher.submitDecision(decision, dummy())
				})
			})

			it("should discard decision after it is sent to referee callback", function (done) {
        var decision = dummy()
        var refereeCallback = jasmine.createSpy("referee callback")

        dispatcher.sendDispatch(dummy(), dummy())

        process.nextTick(function () {
          dispatcher.submitDecision(decision, dummy())

          process.nextTick(function () {
            dispatcher.sendDispatch(dummy(), refereeCallback)

            process.nextTick(function () {
              expect(refereeCallback).not.toHaveBeenCalled()
              done()
            })
          })
        })
      })

      // This tests that sendDispatch discards a used callback
			it("should not send decision to referee callback that was immediately fulfilled", function (done) {
				var refereeCallback = jasmine.createSpy("referee callback")

				dispatcher.submitDecision(dummy(), dummy())

				process.nextTick(function() {
					dispatcher.sendDispatch(dummy(), refereeCallback)

					process.nextTick(function() {
						refereeCallback.calls.reset()

						dispatcher.submitDecision(dummy(), dummy())

						process.nextTick(function () {
							expect(refereeCallback).not.toHaveBeenCalled()
							done()
						})
					})
				})
			})

      // This tests that submitDecision discards a used callback
      it("should not send multiple decisions to referee callback", function (done) {
        var refereeCallback = jasmine.createSpy("referee callback")

        dispatcher.sendDispatch(dummy(), refereeCallback)

        process.nextTick(function() {
          dispatcher.submitDecision(dummy(), dummy())

          process.nextTick(function() {
            refereeCallback.calls.reset()

            dispatcher.submitDecision(dummy(), dummy())

            process.nextTick(function () {
              expect(refereeCallback).not.toHaveBeenCalled()
              done()
            })
          })
        })
      })

			it("should send error to new client callback if one already exists", function (done) {
        var expectedError = new Error("Client submitted decision while waiting for an update")

        var decisionCallback = function (actualError) {
          expect(actualError).toEqual(expectedError)
          done()
        }

        dispatcher.requestUpdate(dummy())

        process.nextTick(function () {
          dispatcher.submitDecision(dummy(), decisionCallback)
        })
      })

			it("should not replace old client callback if one exits", function (done) {
        var dispatch = dummy()

        var updateCallback = function (error, data) {
          expect(error).toBe(null)
          expect(data).toBe(dispatch)
          done()
        }

        dispatcher.requestUpdate(updateCallback)

        process.nextTick(function () {
          dispatcher.submitDecision(dummy(), dummy())

          process.nextTick(function () {
            dispatcher.sendDispatch(dispatch, dummy())
          })
        })
      })

			it("should not replace old decision if one exists", function (done) {
        var firstDecision = dummy()

        var refereeCallback = function (error, data) {
          expect(error).toBe(null)
          expect(data).toBe(firstDecision)
          done()
        }

        dispatcher.submitDecision(firstDecision, dummy())

        process.nextTick(function () {
          dispatcher.submitDecision(dummy(), dummy())

          process.nextTick(function () {
            dispatcher.sendDispatch(dummy(), refereeCallback)
          })
        })
      })

	  	it("should not send dispatch to client if dispatch exists", function (done) {
        var clientCallback = jasmine.createSpy("client callback")

        dispatcher.sendDispatch(dummy(), dummy())

        process.nextTick(function () {
          dispatcher.submitDecision(dummy(), clientCallback)

          process.nextTick(function () {
            expect(clientCallback).not.toHaveBeenCalled()
            done()
          })
        })
      })
		})
		
		/*
		III) The REFEREE sends a DISPATCH whenever it updates the game state
			0) DISPATCHER stores the DISPATCH and REFEREE CALLBACK, enters state A
			A) DISPATCHER replaces DISPATCH and REFEREE CALLBACK, remains in state A
			B) DISPATCHER sends DISPATCH to REQUEST CALLBACK, stores DISPATCH and REFEREE CALLBACK, enters state A
			C) DISPATCHER sends DECISION to REFEREE CALLBACK, discards the DISPATCH, enters state B
		*/
		describe("sending a dispatch", function () {
			it("should send dispatch to client callback if callback exists", function (done) {
				var dispatch = dummy()

				var clientCallback = function (error, data) {
					expect(error).toBe(null)
					expect(data).toBe(dispatch)
					done()
				}

				dispatcher.requestUpdate(clientCallback)

				process.nextTick(function () {
					dispatcher.sendDispatch(dispatch, dummy())
				})
			})

			it("should discard the client callback after it is used", function (done) {
				var clientCallback = jasmine.createSpy("client clientCallback")

				dispatcher.requestUpdate(clientCallback)

				process.nextTick(function () {
					dispatcher.sendDispatch(dummy(), dummy())

					process.nextTick(function () {
						clientCallback.calls.reset()
						dispatcher.sendDispatch(dummy(), dummy())

						process.nextTick(function () {
							expect(clientCallback).not.toHaveBeenCalled()
							done()
						})
					})
				})
			})

			it("should send decision to referee callback if decision exists", function (done) {
				var decision = dummy()

				var refereeCallback = function (error, data) {
					expect(error).toBe(null)
					expect(data).toBe(decision)
					done()
				}

				dispatcher.submitDecision(decision, dummy())

				process.nextTick(function () {
					dispatcher.sendDispatch(dummy(), refereeCallback)
				})
			})

			it("should still send decision to referee if update requests were made in the meantime", function (done) {
				var decision = dummy()

				var refereeCallback = function (error, data) {
					process.nextTick(function () {
						expect(data).toBe(decision)
						done()
					})
				}

				dispatcher.submitDecision(decision, dummy())

				process.nextTick(function () {
					dispatcher.requestUpdate(dummy())

					process.nextTick(function () {
						dispatcher.sendDispatch(dummy(), refereeCallback)
					})
				})
			})
			
			it("should discard decision after it is passed to referee callback", function (done) {
				var refereeCallback = jasmine.createSpy("referee callback")

				dispatcher.submitDecision(dummy(), dummy())

				process.nextTick(function () {
					dispatcher.sendDispatch(dummy(), dummy())

					process.nextTick(function () {
						dispatcher.sendDispatch(dummy(), refereeCallback)

						process.nextTick(function () {
							expect(refereeCallback).not.toHaveBeenCalled()
							done()
						})
					})
				})
			})

			it("should send dispatch to client callback the time after the decision is consumed", function (done) {
				var secondDispatch = dummy()

				var clientCallback = function (error, data) {
					expect(error).toBe(null)
					expect(data).toBe(secondDispatch)
					done()
				}

				var refereeCallback = function () {
					process.nextTick(function () {
						dispatcher.sendDispatch(secondDispatch, dummy())
					})
				}

				dispatcher.submitDecision(dummy(), clientCallback)

				process.nextTick(function () {
					dispatcher.sendDispatch(dummy(), refereeCallback)
				})
			})
		})
	})
})()
