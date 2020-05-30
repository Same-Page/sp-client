import "./Body.css"

import React, { useState } from "react"
import { Popover, Button, Modal } from "antd"
import {
	DeleteOutlined,
	LinkOutlined,
	CloudDownloadOutlined
} from "@ant-design/icons"

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

	const [showMediaModal, setShowMediaModal] = useState(false)

	const { type, name, value } = content
	let res = value
	let className = "sp-message-body " + type

	if (type === "image") {
		res = (
			<>
				{showMediaModal && (
					<Modal
						closable={false}
						centered
						wrapClassName="sp-media-modal"
						visible={showMediaModal}
						onCancel={() => {
							setShowMediaModal(false)
						}}
						footer={null}
					>
						<img src={value} />
					</Modal>
				)}
				<img
					onClick={() => {
						setShowMediaModal(true)
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
			</>
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
