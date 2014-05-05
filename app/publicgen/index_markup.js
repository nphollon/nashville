exports.pageName = "index"

var charsetMeta = {
	tag: "meta",
	"http-equiv": "Content-type",
	content: "text/html;charset=UTF-8"
}

var titleTag = {
	tag: "title",
	body: "Nashville"
}

var stylesheetLink = {
	tag: "link",
	rel: "stylesheet",
	type: "text/css",
	href: "index.css"
}

var htmlHead = {
	tag: "head",
	body: [ charsetMeta, titleTag, stylesheetLink ]
}

var statusHeader = {
	tag: "h2",
	id: "status"
}

var scoreVar = {
	tag: "var",
	id: "score"
}

var scoreHeader = {
	tag: "h3",
	body: [ "Score: ", scoreVar ]
}

var displayDiv = {
	id: "display",
	body: [ statusHeader, scoreHeader ]
}

var wagerInput = {
	tag: "input",
	id: "wager",
	type: "text",
	value: "1"
}

var wagerHeader = {
	tag: "h3",
	body: [ "Wager", wagerInput ]
}

var submitButton = {
	id: "submit",
	class: "button",
	body: "Submit"
}

var controlsDiv = {
	id: "controls",
	body: [ wagerHeader, submitButton ]
}

var mainDiv = {
	id: "main",
	body: [ displayDiv, controlsDiv ]
}

var scriptTag = {
	tag: "script",
	type: "text/javascript",
	src: "index.js",
	body: ""
}

var htmlBody = {
	tag: "body",
	body: [ mainDiv, scriptTag ]
}

exports.document = {
	tag: "html",
	body: [ htmlHead, htmlBody ]
}

var textColor = "#E8DDCB"
var bkgColor = "#033649"
var buttonBkgColor = "#036564"
var buttonTextColor = "#CDB380"
var buttonHoverColor = "#031634"
var fieldHeight = "20px"
var buttonHeight = "30px"

exports.styles = [
	{ id: "main", style: {
		"background-color": bkgColor,
	  color: textColor,
	  "font-family": "sans-serif",
	  "text-align": "center",
	  width: "500px",
	  "padding-top": "10px",
	  "padding-bottom": "30px"
	}},
	{ sel: "var", style: {
		"font-style": "normal"
	}},
	{ sel: "input", style: {
	  "background-color": buttonBkgColor,
	  color: buttonTextColor,
	  "text-align": "center",
	  width: "50px",
	  height: fieldHeight,
	  border: "none",
	  "border-radius": fieldHeight
	}},
	{ sel: "input:focus", style: {
		"background-color": buttonHoverColor,
    outline: "none"
	}},
	{ cl: "button", style: {
	  "border-color": buttonTextColor,
	  "background-color": buttonBkgColor,
	  color: buttonTextColor,
	  "font-family": "sans-serif",
	  cursor: "pointer",
	  "text-align": "center",
	  width: "100px",
	  height: buttonHeight,
	  "line-height": buttonHeight,
	  "margin-left": "auto",
	  "margin-right": "auto",
	  border: "3px",
	  "border-style": "solid",
	  "border-radius": buttonHeight
	}},
	{ sel: ".button:hover", style: {
		"background-color": buttonHoverColor
	}}
]

exports.scripts = ["./app/client/main.js"]