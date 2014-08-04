"use strict";

var async = require("async")

var transformWith = function (iterator) {
  return function (args, callback) {
    iterator.apply(null, args.concat(callback))
  }
}

var transformListsWith = function (iterator, callback) {
  return function (err, lists) {
    async.map(lists, transformWith(iterator), callback)
  }
}

var get = function (index) {
  return function (list, done) {
    done(null, list[index])
  }
}

var slice = function (lists) {
  return function (index, taskDone) {
    async.map(lists, get(index), taskDone)
  }
}

exports.zipMap = function (lists, iterator, callback) {
  if (lists.length < 1) {
    process.nextTick(function () {
      callback(new Error("First argument to zipMap should not be empty"))
    })
    return
  }

  var indexes = []

  async.each(lists[0],
    function (item, done) {
      indexes.push(indexes.length)
      done()
    },
    function () {
      async.map(indexes, slice(lists), transformListsWith(iterator, callback))
    }
  )
}
