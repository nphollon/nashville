describe("The response", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var stateFactory = helpers.requireSource("server/game/states")

  it("should not contain the next event type or player index", function () {
    var state = stateFactory.build()
    expect(state.hasOwnProperty("nextEventType")).toBe(true)
    expect(state.hasOwnProperty("nextPlayerIndex")).toBe(true)
    var response = state.toResponse(0)
    expect(response.hasOwnProperty("nextEventType")).toBe(false)
    expect(response.hasOwnProperty("nextPlayerIndex")).toBe(false)
  })

  it("should contain the same wager", function () {
    var state = stateFactory.build({ wager: 1 })
    var response = state.toResponse(0)
    expect(response.wager).toEqual(state.wager)
  })

  it("should contain lose message if player lost", function () {
    var state = stateFactory.build({ winnerIndex: 1 })
    var response = state.toResponse(0)
    expect(response.status).toEqual("You lost.")
  })

  it("should contain win message if player won", function () {
    var state = stateFactory.build({ winnerIndex: 0 })
    var response = state.toResponse(0)
    expect(response.status).toEqual("You won.")
  })

  it("should contain instruction if nobody has won yet", function () {
    var state = stateFactory.build({ winnerIndex: undefined })
    var response = state.toResponse(0)
    expect(response.status).toEqual("Place your bet.")
  })

  it("should enable input for first player if it is their turn", function () {
    var state = stateFactory.build({ nextPlayerIndex: 0 })
    var response = state.toResponse(0)
    expect(response.enableInput).toBe(true)
  })

  it("should disable input for first player if it is not their turn", function () {
    var state = stateFactory.build({ nextPlayerIndex: 1 })
    var response = state.toResponse(0)
    expect(response.enableInput).toBe(false)
  })

  it("should enable input for second player if it is their turn", function () {
    var state = stateFactory.build({ nextPlayerIndex: 1 })
    var response = state.toResponse(1)
    expect(response.enableInput).toBe(true)
  })

  it("should be immutable", function () {
    var state = stateFactory.build()
    var response = state.toResponse(0)
    expect(Object.isFrozen(response)).toBe(true)
  })
})