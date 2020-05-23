import React from "react"
import { Alert } from "antd"

function SPAlert({ text, border }) {
	const borderStyle = "1px solid #ffe58f"
	const style = {}
	if (border === "top") {
		style["borderTop"] = borderStyle
	}
	if (border === "bottom") {
		style["borderBottom"] = borderStyle
	}

	return (
		<Alert
			style={style}
			banner
			type="warning"
			message={<span style={{ marginLeft: 5 }}>{text}</span>}
		/>
	)
}

export default SPAlert
