import "./Header.css"
import React from "react"

function Header({ leftItems, rightItems, centerItems }) {
	// If there's center items, left and right items need to be position:absolute
	const className =
		"sp-text-noselect sp-tab-content-header" + (centerItems ? " sp-center" : "")
	return (
		<div className={className}>
			<span className="sp-header-left-items">{leftItems}</span>
			<span className="sp-header-center-items">{centerItems}</span>
			<span className="sp-header-right-items">{rightItems}</span>
			<div style={{ clear: "both" }}></div>
		</div>
	)
}

export default Header
