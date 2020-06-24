import "./Body.css"

import React, { useState } from "react"
import { Popover, Modal } from "antd"
import { LinkOutlined, CloudDownloadOutlined } from "@ant-design/icons"

function MessageBody({ content, self, imageLoadedCb, messageActions }) {
	// contentType can be image|text|url|file|video|music|etc.
	// content is always an object with name and value, there
	// could be more fields on it in the futrue
	// {
	//  type: text|image|url|media|etc.,
	// 	name: null|''|file name|video name,
	// 	value: text|url|img_src|video_src etc.,
	// 	metadata: {...} optional
	// }
	const [menuVisible, setMenuVisible] = useState(false)
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
						className="sp-modal sp-media-modal"
						visible={true}
						onCancel={() => {
							setShowMediaModal(false)
						}}
						footer={null}
					>
						<img alt={value} src={value} />
					</Modal>
				)}
				<img
					onClick={() => {
						// close popover menu
						setMenuVisible(false)
						// window.spDebug("click on image")
						if (window.parent) {
							window.parent.postMessage({ imgSrc: value }, "*")
						} else {
							setShowMediaModal(true)
						}
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
	const popoverContent = messageActions()

	let contentWrapper = <div className={className}>{res}</div>

	return popoverContent ? (
		<Popover
			overlayClassName="sp-message-menu"
			placement={self ? "left" : "right"}
			content={popoverContent}
			trigger="hover"
			// had to add this logic to account for clicking image
			// which opens a modal and mouse leave is never triggered
			visible={menuVisible}
			onVisibleChange={val => {
				setMenuVisible(val)
			}}
		>
			{contentWrapper}
		</Popover>
	) : (
		contentWrapper
	)
}

export default MessageBody
