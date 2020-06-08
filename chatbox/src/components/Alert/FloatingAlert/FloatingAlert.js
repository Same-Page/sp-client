import "./FloatingAlert.css"

import React from "react"
import { Alert } from "antd"

function FloatingAlert({ text, type, showIcon }) {
	return (
		<Alert
			className="sp-floating-alert"
			message={<span style={{ marginLeft: 5 }}>{text}</span>}
			showIcon={showIcon}
			type={type || "warning"}
			// banner
		/>
	)
}

export default FloatingAlert
