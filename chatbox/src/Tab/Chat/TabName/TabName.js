import "./TabName.css"
import React from "react"
import { Tooltip } from "antd"

function TabName({ showAntdTooltip, iconUrl, title, tabName }) {
	// Either show antd tooltip or use title attribute
	const content = (
		<span
			className="sp-chat-tab-title"
			title={showAntdTooltip ? undefined : title}
		>
			{iconUrl && (
				<img
					alt={tabName}
					src={iconUrl}
					className="sp-loadable-img"
					onError={ev => {
						ev.target.style = "display:none;"
						ev.target.className = "sp-bad-img"
					}}
				/>
			)}
			<span>{tabName}</span>
		</span>
	)

	return showAntdTooltip ? (
		<Tooltip title={title} placement="right">
			{content}
		</Tooltip>
	) : (
		content
	)
}

export default TabName
