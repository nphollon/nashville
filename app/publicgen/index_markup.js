exports.pageName = "index"

exports.document = { tag: "html",	body: [
	{ tag: "head", body: [
		{ tag: "title",	body: "Welcome!" },
		{ tag: "meta",
			"http-equiv": "Content-type",
			content: "text/html;charset=UTF-8"
		},
		{ tag: "title", body: "Nashville" },
		{ tag: "link",
			rel: "stylesheet",
			type: "text/css",
			href: "index.css"
		}
	]},
	{ tag: "body", body: [
		{ id: "status", body: "Hello" },
		{ body: "Score: " },
		{ id: "score", body: " "},
		{ tag: "script",
			type: "text/javascript",
			src: "index.js",
			body: ""
		},
		{ tag: "input",
			id: "wager",
			type: "text"
		},
		{ tag: "input",
			id: "submit",
			type: "button",
			value: "Submit"
		}
	]}
]}

exports.styles = { id: "status", style: { color: "red" } }

exports.scripts = ["./app/client/main.js"]