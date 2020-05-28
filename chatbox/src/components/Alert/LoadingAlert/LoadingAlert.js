import "./LoadingAlert.css"

import React from "react"
import { Alert } from "antd"

import { LoadingOutlined } from "@ant-design/icons"

function LoadingAlert({ text }) {
	return (
		<Alert
			className="sp-loading-alert"
			message={<span style={{ marginLeft: 10 }}>{text}</span>}
			icon={<LoadingOutlined />}
			type="warning"
			// banner
		/>
	)
}

export default LoadingAlert
