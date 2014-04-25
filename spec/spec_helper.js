jasmine.DEFAULT_TIMEOUT_INTERVAL = 500 // milliseconds

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

exports.checkArgumentAndForward = function (expectedArgument, callbackArgument) {
	return function (argument, callback) {
		if (argument === expectedArgument) {
			callback(null, callbackArgument)
		}
	}
}
