import "./Body.css"

import React from "react"
import { Popover, Button } from "antd"
import {
	DeleteOutlined,
	LinkOutlined,
	CloudDownloadOutlined
} from "@ant-design/icons"

function isPureEmoji(string) {
	if (!string) return false
	var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g

	return string.replace(regex, "") === ""
}
function MessageBody({ content, self, imageLoadedCb, showMenu }) {
	// contentType can be image|text|url|file|video|music|etc.
	// content is always an object with name and value, there
	// could be more fields on it in the futrue
	// {
	//  type: text|image|url|media|etc.,
	// 	name: null|''|file name|video name,
	// 	value: text|url|img_src|video_src etc.,
	// 	metadata: {...} optional
	// }

	const { type, name, value } = content
	const res = value
	let className = "sp-message-body " + type

	if (type === "image") {
		res = (
			<img
				onClick={() => {
					// window.spDebug("click on image")
					// window.parent.postMessage({ imgSrc: imgSrc }, "*")
				}}
				onLoad={() => {
					imageLoadedCb()
				}}
				className="sp-message-image"
				alt={""}
				src={value}
			/>
		)
	} else if (type === "file") {
		res = (
			<a href={value} rel="noopener noreferrer" target="_blank" download>
				<CloudDownloadOutlined style={{ marginRight: 5 }} />
				{name}
			</a>
		)
	}
	if (type === "url") {
		res = (
			<div>
				<a target="_blank" rel="noopener noreferrer" href={value}>
					<LinkOutlined style={{ marginRight: 5 }} />
					{name}
				</a>
			</div>
		)
	}
	const popoverContent = (
		<div>
			<Button
				onClick={() => {
					// TODO: this should be passed down
					// const payload = {
					// 	action: "delete_message",
					// 	data: {
					// 		messageId: props.data.id,
					// 		roomId: props.room.id,
					// 		token: props.account.token
					// 	}
					// }
					// socketManager.sendEvent(payload)
				}}
			>
				<DeleteOutlined />
			</Button>
		</div>
	)

	let contentWrapper = <div className={className}>{res}</div>

	return showMenu ? (
		<Popover
			overlayClassName="sp-message-menu"
			placement={self ? "left" : "right"}
			content={popoverContent}
			trigger="hover"
		>
			{contentWrapper}
		</Popover>
	) : (
		contentWrapper
	)
}

export default MessageBody
