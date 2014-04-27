;(function () {
	"use strict";
	
	var indexMarkup = require("./publicgen/index_markup")
	var document = indexMarkup.document
	var styles = indexMarkup.styles

	var webgenjs = require("webgenjs")
	var generateCSS = webgenjs.cssgen.generateCSS
	var generateHTML = webgenjs.htmlgen.generateHTML
	
	var compile = require("./publicgen/compile").compile
	compile(document, "public/index.html", generateHTML)
	compile(styles, "public/index.css", generateCSS)
})()