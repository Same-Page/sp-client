import "./FloatingAlert.css"

import React from "react"
import { Alert } from "antd"

function FloatingAlert({ text, type, showIcon, icon }) {
	return (
		<Alert
			className="sp-floating-alert"
			message={<span style={{ marginLeft: 5 }}>{text}</span>}
			showIcon={showIcon || icon}
			icon={icon}
			type={type || "warning"}
			// banner
		/>
	)
}

export default FloatingAlert
