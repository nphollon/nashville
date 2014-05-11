"use strict";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 500 // milliseconds

exports.requireSource = function (sourceFile) {
	return require("../app/" + sourceFile)
}

exports.mock = function (stubMethods) {
	var mock = {}
	stubMethods.forEach(function (stubMethod) {
		mock[stubMethod] = function () {}
		spyOn(mock, stubMethod)
	})
	return mock
}

exports.dummy = function () {
  return function () {}
}

exports.checkArgumentAndReturn = function (expectedArgument, returnValue) {
	return function (argument) {
		return (argument === expectedArgument) ? returnValue : undefined
	}
}
