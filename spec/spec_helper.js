"use strict";

exports.requireSource = function (sourceFile) {
	return require("../app/" + sourceFile)
}

exports.dummy = function () {
  return function () {}
}

exports.setSpecTimeout = function (duration) {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = duration
}

exports.resetSpecTimeout = function () {
  this.setSpecTimeout(500)
}

exports.later = function (callback) {
	setTimeout(callback, 10)
}

exports.resetSpecTimeout()