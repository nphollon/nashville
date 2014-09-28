describe("A response", function () {
  "use strict";

  var helpers = require("../../spec_helper")
  var stateFactory = helpers.requireSource("server/game/states")
  var toResponse = helpers.requireSource("server/game/response")
  var dummy = helpers.dummy
  var expectIsFrozen = helpers.expectIsFrozen

  it("should be frozen", function (done) {
    var state = stateFactory.build(1)
    toResponse(state, 0, function (response) {
      expectIsFrozen(response)
      done()
    })
  })

  it("should not contain the next event type or player index", function (done) {
    var state = stateFactory.build(1)
    expect(state.hasOwnProperty("nextEventType")).toBe(true)
    expect(state.hasOwnProperty("nextPlayerIndex")).toBe(true)
    toResponse(state, 0, function (response) {
      expect(response.hasOwnProperty("nextEventType")).toBe(false)
      expect(response.hasOwnProperty("nextPlayerIndex")).toBe(false)
      done()
    })
  })

  it("should contain the same wager", function (done) {
    var expectedWager = dummy()
    var state = stateFactory.build(2, { wager: expectedWager })
    toResponse(state, 0, function (response) {
      expect(response.wager).toEqual(expectedWager)
      done()
    })
  })

  it("should contain the same status", function (done) {
    var expectedStatus = dummy()
    var state = stateFactory.build(2, { status: expectedStatus })
    toResponse(state, 0, function (response) {
      expect(response.status).toEqual(expectedStatus)
      done()
    })
  })

  // TODO finish converting data structure (scores --> players)
  it("should contain the same list of scores", function (done) {
    var expectedScores = [ dummy(), dummy() ]
    var expectedPlayers = [ { score: expectedScores[0], card: 1 }, { score: expectedScores[1], card: 1 } ]
    var state = stateFactory.build(2, { scores: expectedScores })
    toResponse(state, 0, function (response) {
      expect(response.players).toEqual(expectedPlayers)
      done()
    })
  })

  it("should contain index 0 if the response is for player 0", function (done) {
    var state = stateFactory.build(2)
    toResponse(state, 0, function (response) {
      expect(response.playerIndex).toEqual(0)
      done()
    })
  })

  it("should contain index 1 if the response is for player 1", function (done) {
    var state = stateFactory.build(2)
    toResponse(state, 1, function (response) {
      expect(response.playerIndex).toEqual(1)
      done()
    })
  })

  describe("enabling player input", function () {
    var fullInput = {
      enableText: true,
      enableSubmit: true,
      instruction: "Place a wager",
      action: "Submit"
    }

    var noInput = {
      enableText: false,
      enableSubmit: false,
      instruction: "",
      action: ""
    }

    var confirmation = {
      enableText: false,
      enableSubmit: true,
      instruction: "",
      action: "Continue"
    }

    it("should fully enable input for first player if it is their turn", function (done) {
      var state = stateFactory.build(2, { nextPlayerIndex: 0 })
      toResponse(state, 0, function (response) {
        expect(response.input).toEqual(fullInput)
        expectIsFrozen(response.input)
        done()
      })
    })

    it("should enable input for second player if it is their turn", function (done) {
      var state = stateFactory.build(2, { nextPlayerIndex: 1 })
      toResponse(state, 1, function (response) {
        expect(response.input).toEqual(fullInput)
        done()
      })
    })

    it("should disable input for first player if they just had a turn", function (done) {
      var state = stateFactory.build(2, { nextPlayerIndex: 2, lastPlayerIndex: 0 })
      toResponse(state, 0, function (response) {
        expect(response.input).toEqual(noInput)
        expectIsFrozen(response.input)
        done()
      })
    })

    it("should enable confirmation for first player if their turn is neither next nor last", function (done) {
      var state = stateFactory.build(2, { nextPlayerIndex: 2, lastPlayerIndex: 1 })
      toResponse(state, 0, function (response) {
        expect(response.input).toEqual(confirmation)
        expectIsFrozen(response.input)
        done()
      })
    })
  })
})
