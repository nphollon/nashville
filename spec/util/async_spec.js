describe("Async helpers", function () {
  "use strict";

  var helpers = require("../spec_helper")
  var async = helpers.requireSource("util/async")

  var dummy = helpers.dummy

  describe("zipMap", function () {
    it("should return empty list if first list is empty", function (done) {
      async.zipMap([[]], dummy(), function (err, results) {
        expect(err).toBeFalsy()
        expect(results).toEqual([])
        done()
      })
    })

    it("should map iterator over sublist if there is only one sublist", function (done) {
      var arr = [ 5, 10, -2 ]

      var iterator = function (item, callback) {
        callback(null, item * item)
      }

      async.zipMap([arr], iterator, function (err, results) {
        expect(err).toBeFalsy()
        expect(results).toEqual([ 25, 100, 4 ])
        done()
      })
    })

    it("should pass item from each sublist to the iterator", function (done) {
      var arr1 = [ 100, 200, 300 ]
      var arr2 = [ 4, 3, 2 ]

      var iterator = function (item1, item2, callback) {
        callback(null, item1 - item2)
      }

      async.zipMap([arr1, arr2], iterator, function (err, results) {
        expect(err).toBeFalsy()
        expect(results).toEqual([ 96, 197, 298 ])
        done()
      })
    })

    it("should return error if there are no sublists", function (done) {
      async.zipMap([], dummy(), function (err) {
        expect(err).toBeTruthy()
        expect(err.message).toEqual("First argument to zipMap should not be empty")
        done()
      })
    })

    it("should return error if iterator returns error", function (done) {
      var arr = [0, 2]

      var iterator = function (item, callback) {
        if (item > 0) {
          callback(new Error("test error"))
        } else {
          callback(null, item)
        }
      }

      async.zipMap([arr], iterator, function (err) {
        expect(err).toBeTruthy()
        expect(err.message).toEqual("test error")
        done()
      })
    })
  })
})