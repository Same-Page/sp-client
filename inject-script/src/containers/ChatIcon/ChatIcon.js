import React, { useState, useEffect } from "react"
import Draggable from "react-draggable"

import storage from "storage.js"
import samePageIcon from "icon.png"
import MailIcon from "@material-ui/icons/Mail"
import spConfig from "config"

const SHOW_CHAT_ICON_BY_DEFAULT = true
let dragging = false

function ChatIcon({ userCount, storageData, roomName }) {
	const [showIcon, setShowIcon] = useState(false)

	const [unreadMail, setUnreadMail] = useState(false)

	let className = "sp-chat-icon-wrapper"
	if (spConfig.icon && spConfig.icon.verticalCenter) {
		className += " vertical-center"
	}
	useEffect(() => {
		if (storageData.showChatIcon == null) {
			setShowIcon(SHOW_CHAT_ICON_BY_DEFAULT)
		} else {
			setShowIcon(storageData.showChatIcon)
		}

		storage.addEventListener("showChatIcon", (showChatIcon) => {
			setShowIcon(showChatIcon)
		})

		setUnreadMail(!!storageData.unread)

		storage.addEventListener("unread", (unread) => {
			setUnreadMail(!!unread)
		})
	}, [storageData])

	if (showIcon) {
		let iconContent = (
			<img
				alt="Same Page"
				draggable="false"
				style={{ display: "none" }}
				src={samePageIcon}
			/>
		)
		if (userCount > 0) {
			iconContent = userCount
		}
		if (unreadMail) {
			iconContent = <MailIcon style={{ marginBottom: -7 }} />
		}
		return (
			<Draggable
				onStart={() => {
					dragging = false
				}}
				onDrag={() => {
					dragging = true
				}}
				onStop={(e) => {
					if (!dragging) {
						window.toggleChatbox()
					}
					dragging = false
				}}
			>
				<span title={roomName} className={className}>
					{iconContent}
				</span>
			</Draggable>
		)
	}
	return <span />
}

export default ChatIcon
