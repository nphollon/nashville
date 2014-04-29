"use strict";

var fs = require("fs")
var webgenjs = require("webgenjs")
var browserify = require("browserify")

var errorLogger = function (outputFile) {
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

var compile = function (sourceObject, outputFile, generator) {
	var logErrors = errorLogger(outputFile)

	generator(sourceObject, logErrors(function (data) {
		fs.writeFile(outputFile, data, logErrors(function () {
			console.log("Compiled " + outputFile)
		}))
	}))
}

var generateHTML = webgenjs.htmlgen.generateHTML

var generateCSS = webgenjs.cssgen.generateCSS

var generateJS = function (sourceObject, callback) {
	browserify(sourceObject).bundle({}, callback)
}

exports.compileAll = function (outputDir, markupFile) {
	var markup = require("./" + markupFile)
	var outputPrefix = outputDir + "/" + markup.pageName

	compile(markup.document, outputPrefix + ".html", generateHTML)
	compile(markup.styles, outputPrefix + ".css", generateCSS)
	compile(markup.scripts, outputPrefix + ".js", generateJS)
}
