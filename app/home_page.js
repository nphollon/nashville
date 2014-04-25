;(function (module) {
	"use strict"

	var htmlgen = require("webgenjs").htmlgen

	module.render = function (requestBody, callback) {
		var document = { tag: "html",	body: [
				{ tag: "head", body: 
						{ tag: "title",	body: "Welcome!" }
				},
				{ tag: "body", body:
						{ id: "status", body: "Hello" }
				}
			]
		}
		htmlgen.generateHTML(document, callback)
	}

})(exports)