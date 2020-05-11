import "./TabName.css"
import React from "react"
import { Tooltip } from "antd"

function TabName({ minimized, iconUrl, title, floatRightExtra, description }) {
	// If miniimzed, show Tooltip but no html title attribute
	// and only show icon if there's icon
	let tabName = title
	if (minimized) {
		tabName = tabName.substring(0, 2)
	}

	const content = (
		<span
			className="sp-vertical-tab-name"
			title={minimized ? undefined : title}
		>
			{iconUrl && (
				<img
					alt={tabName}
					src={iconUrl}
					// className="sp-loadable-img"
					onError={ev => {
						// this broken image handling can be
						// a reusable component
						ev.target.style = "display:none;"
						ev.target.className = "sp-broken-img"
					}}
				/>
			)}
			{(!minimized || !iconUrl) && (
				<span className="sp-tab-name">{tabName}</span>
			)}
			{!minimized && (
				<span className="sp-float-right-extra">{floatRightExtra}</span>
			)}

			{!minimized && description && (
				<div className="sp-tab-description">{description}</div>
			)}
		</span>
	)

	return minimized ? (
		<Tooltip title={title} placement="right">
			{content}
		</Tooltip>
	) : (
		content
	)
}

export default TabName
