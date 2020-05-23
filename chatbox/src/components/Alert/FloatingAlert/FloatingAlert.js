import "./FloatingAlert.css"

import React from "react"
import { Alert } from "antd"

function FloatingAlert({ text }) {
	return (
		<Alert
			className="sp-loading-alert"
			message={<span style={{ marginLeft: 5 }}>{text}</span>}
			type="warning"
			banner
		/>
	)
}

export default FloatingAlert
