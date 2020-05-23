import "./FloatingAlert.css"

import React from "react"
import { Alert } from "antd"

// import { LoadingOutlined } from "@ant-design/icons"

function FloatingAlert({ text, icon }) {
	// icon = icon || <></>
	return (
		<Alert
			className="sp-loading-alert"
			message={<span style={{ marginLeft: 5 }}>{text}</span>}
			// icon={<LoadingOutlined />}
			// icon={icon}
			type="warning"
			banner
		/>
	)
}

export default FloatingAlert
