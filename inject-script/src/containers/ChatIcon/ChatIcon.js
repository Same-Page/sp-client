import React, { useState, useEffect } from "react"
import Draggable from "react-draggable"

import storage from "storage.js"
import samePageIcon from "icon.png"
import MailIcon from "@material-ui/icons/Mail"
import spConfig from "config"
import { postMsgToIframe } from "utils/iframe"

const SHOW_CHAT_ICON_BY_DEFAULT = true
let dragging = false

function ChatIcon({ userCount, storageData, roomName, unread }) {
	const [showIcon, setShowIcon] = useState(
		storageData.showChatIcon == null ? true : storageData.showChatIcon
	)

	let className = "sp-chat-icon-wrapper"
	if (spConfig.icon && spConfig.icon.verticalCenter) {
		className += " vertical-center"
	}

	useEffect(() => {
		storage.addEventListener("showChatIcon", (showIcon) => {
			setShowIcon(showIcon)
			postMsgToIframe("show_icon", showIcon)
		})
	}, [])
	useEffect(() => {
		const handler = (e) => {
			if (!e || !e.data) return
			const data = e.data
			if (data.name === "get_settings") {
				postMsgToIframe("show_icon", showIcon)
			}
		}
		window.addEventListener("message", handler)
		return () => {
			window.removeEventListener("message", handler)
		}
	}, [showIcon])

	// useEffect(() => {
	// 	window.addEventListener("message", e => {
	// 		if (!e || !e.data) return
	// 		const data = e.data
	// 		if (data.name === "get_settings") {
	// 			postMsgToIframe("show_avatar", showAvatar)
	// 		}
	// 	})
	// 	if (storageData.showChatIcon == null) {
	// 		setShowIcon(SHOW_CHAT_ICON_BY_DEFAULT)
	// 	} else {
	// 		setShowIcon(storageData.showChatIcon)
	// 	}

	// 	storage.addEventListener("showChatIcon", (showChatIcon) => {
	// 		setShowIcon(showChatIcon)
	// 	})
	// }, [storageData])

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
		if (unread) {
			iconContent = <MailIcon style={{ marginBottom: -9 }} />
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
