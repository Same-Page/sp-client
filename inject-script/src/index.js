import "./index.css"

import React from "react"
import ReactDOM from "react-dom"
import App from "./containers/App"
import * as serviceWorker from "./serviceWorker"

const elmId = "sp_extension_root"
setTimeout(() => {
	// do not mount anything if found certain element on the page

	var element = document.getElementById("no_sp_extension")
	if (element) {
		console.log("should not load sp")
		return
	}

	element = document.getElementById(elmId)
	if (element) {
		console.log("already contain injection script")
		return
	}

	console.debug("starting injection script...")

	const appElement = document.createElement("span")
	appElement.id = elmId
	document.body.appendChild(appElement)

	ReactDOM.render(<App />, appElement)

	// If you want your app to work offline and load faster, you can change
	// unregister() to register() below. Note this comes with some pitfalls.
	// Learn more about service workers: http://bit.ly/CRA-PWA
	serviceWorker.unregister()
}, 1000)
