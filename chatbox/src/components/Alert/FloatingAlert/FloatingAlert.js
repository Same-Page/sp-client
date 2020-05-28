import "./FloatingAlert.css"

import React from "react"
import { Alert } from "antd"

function FloatingAlert({ text, type }) {
	return (
		<Alert
			className="sp-floating-alert"
			message={<span style={{ marginLeft: 5 }}>{text}</span>}
			type={type || "warning"}
			// banner
		/>
	)
}

export default FloatingAlert
