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
			len += 1.1
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

	title,
	unread
}) {
	// If miniimzed, show Tooltip but no html title attribute
	// and only show icon if there's icon
	let tabName = title

	tabName = substringHelper(tabName, minimized ? 3 : 8)

	const showTooltip = tabName.length < title.length

	const content = (
		<span
			className={
				"sp-text-noselect sp-vertical-tab-name" + (unread ? " unread" : "")
			}
			title={showTooltip ? undefined : title}
		>
			<div className="sp-tab-text">
				<div className="sp-tab-name">{tabName}</div>
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
