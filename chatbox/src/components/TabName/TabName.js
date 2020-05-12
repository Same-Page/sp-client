import "./TabName.css"
import React from "react"
import { Tooltip } from "antd"

function TabName({
	minimized,
	iconUrl,
	size,

	title,
	floatRightExtra,
	description
}) {
	// If miniimzed, show Tooltip but no html title attribute
	// and only show icon if there's icon
	let tabName = title
	if (minimized) {
		if (size === "large") {
			tabName = tabName.substring(0, 5)
			//TODO: English letter is shorter, can include more
		} else {
			tabName = tabName.substring(0, 5)
		}
	}

	const showTooltip = minimized && size !== "large"

	const content = (
		<span
			className={"sp-vertical-tab-name " + (size || "")}
			title={showTooltip ? undefined : title}
		>
			{iconUrl && (
				<img
					alt={tabName}
					src={iconUrl}
					// className="sp-loadable-img"
					onError={ev => {
						// this broken image handling can be
						// a reusable component, still display rather than
						// hide the problem
						// ev.target.style = "display:none;"
						ev.target.className = "sp-broken-img"
					}}
				/>
			)}
			<div className="sp-tab-text">
				{!minimized && (
					<div className="sp-float-right-extra">{floatRightExtra}</div>
				)}
				{(!minimized || !iconUrl || size === "large") && (
					<div className="sp-tab-name">{tabName}</div>
				)}

				{!minimized && description && (
					<div className="sp-tab-description">{description}</div>
				)}
			</div>
		</span>
	)

	return showTooltip ? (
		<Tooltip title={title} placement="right">
			{content}
		</Tooltip>
	) : (
		content
	)
}

export default TabName
