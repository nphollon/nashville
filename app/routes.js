var buildRoute = function (method, callback) {
	return {
		method: method,
		processRequest: callback
	}
}

var get = function (callback) {
	return buildRoute("GET", callback)	
}

var post = function (callback) {
	return buildRoute("POST", callback)
}

exports["/"] = get(function () {})
