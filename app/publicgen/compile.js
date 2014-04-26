var fs = require("fs")

exports.errorLogger = function (outputFile) {
	return function (callback) {
		return function (error, data) {
			if (error === null) {
				callback(data)
			} else {
				console.log("Error while compiling " + outputFile)
				console.log("\t" + error)
			}
		}
	}
}

exports.compile = function (sourceObject, outputFile, generator) {
	var logErrors = exports.errorLogger(outputFile)

	generator(sourceObject, logErrors(function (data) {
		fs.writeFile(outputFile, data, logErrors(function () {
			console.log("Compiled " + outputFile)
		}))
	}))
}