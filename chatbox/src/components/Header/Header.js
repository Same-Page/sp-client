import "./Header.css"
import React from "react"

function Header({ leftItems, rightItems }) {
	return (
		<div className="sp-tab-content-header">
			<span className="sp-text-noselect">{leftItems}</span>
			<div className="sp-header-right-items">{rightItems}</div>
			{/* <div style={{ clear: "both" }} /> */}
		</div>
	)
}

export default Header
