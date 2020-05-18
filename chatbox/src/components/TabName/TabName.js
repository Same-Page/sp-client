import "./TabName.css"
import React from "react"
import { Tooltip } from "antd"

function substringHelper(s, limit) {
	let len = 0
	for (let i = 0; i < s.length; i++) {
		const c = s[i]
		if (c.match(/[\u3400-\u9FBF]/)) {
			len += 2
		} else {
			len += 1.5
		}
		if (len === limit) {
			return s.substring(0, i + 1)
		} else if (len > limit) {
			return s.substring(0, i)
		}
	}
	return s
}

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
	// if (minimized) {
	// 	if (size === "large") {
	// 		// TODO: large is shorter actually, fix this
	// 		// Note: this number is dependent on how many pixels
	// 		// we set the tab bar to be, right now it's 8 char for 80 pixels
	// 		tabName = substringHelper(tabName, 8)
	// 	} else {
	// 		tabName = substringHelper(tabName, 3)
	// 	}
	// }

	tabName = substringHelper(tabName, minimized ? 3 : 8)

	// const showTooltip =
	// 	minimized && size !== "large" && tabName.length < title.length
	const showTooltip = tabName.length < title.length

	const content = (
		<span
			className={"sp-text-noselect sp-vertical-tab-name " + (size || "")}
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
