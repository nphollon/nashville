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