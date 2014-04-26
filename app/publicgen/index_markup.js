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
	{ tag: "body", body:
			{ id: "status", body: "Hello" }
	}
]}

exports.styles = { id: "status", style: { color: "red" } }