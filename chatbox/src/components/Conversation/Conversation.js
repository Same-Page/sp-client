import "./Conversation.css"
import React, { useRef, useEffect, useState, useCallback } from "react"
import moment from "moment"

import Message from "./Message"

const AUTO_SCROLL_TRESHOLD_DISTANCE = 500

const conversationBodyStyle = {}

function Conversation({
	messages,
	background,
	backgroundColor,
	messageUser,
	messageActions
}) {
	// scroll to bottom when first time load room messages
	// regardless distannce to bottom
	const [firstTimeAutoScroll, setFirstTimeAutoScroll] = useState(true)
	const bodyStyle = { ...conversationBodyStyle }

	if (background) {
		bodyStyle.backgroundImage = `url('${background}')`
	} else if (backgroundColor) {
		bodyStyle.background = backgroundColor
	}
	const imageLoadedCb = () => {
		console.debug("img loaded")
		scrollToBottomIfNearBottom()
	}

	const scrollToBottomIfNearBottom = useCallback(forceScroll => {
		const timeout = 100 // need this still?

		const bodyDiv = bodyRef.current
		if (!bodyDiv) {
			console.error("no chat body div to scroll to bottom")
			return
		}
		if (
			forceScroll ||
			bodyDiv.scrollHeight - bodyDiv.scrollTop - bodyDiv.offsetHeight <
				AUTO_SCROLL_TRESHOLD_DISTANCE
		) {
			setTimeout(() => {
				bodyDiv.scrollTop = bodyDiv.scrollHeight
			}, timeout)
		}
	}, [])
	const bodyRef = useRef(null)
	useEffect(() => {
		if (messages.length > 0) {
			scrollToBottomIfNearBottom(firstTimeAutoScroll)
			setFirstTimeAutoScroll(false)
		}
	}, [messages.length, firstTimeAutoScroll, scrollToBottomIfNearBottom])

	let res = []
	let lastMsg = null
	messages.forEach(msg => {
		msg.created_at = moment.utc(msg.created_at)
		//   const blacklisted =
		// 	blacklist.filter(u => {
		// 	  return u.id === msg.user.id
		// 	}).length > 0
		//   if (blacklisted) {
		// 	// spDebug(`[Body.js] blacklisted user ${data.user.name} talking`)
		// 	return
		//   }
		// If same user is talking, no need to show user's avatar again
		let showUser = true
		// If it's been more than 5 mins since last msg
		let showTimestamp = false
		let timeDisplay = null

		if (lastMsg) {
			if (lastMsg.user.id.toString() === msg.user.id.toString())
				showUser = false
			if (msg.created_at.diff(lastMsg.created_at) > 5 * 60 * 1000) {
				showTimestamp = true
				showUser = true
			}
		} else {
			showTimestamp = true
			showUser = true
		}

		if (showTimestamp) {
			if (moment().diff(msg.created_at) > 24 * 60 * 60 * 1000)
				timeDisplay = msg.created_at.local().format("MMMDo HH:mm")
			else timeDisplay = msg.created_at.local().format("HH:mm")
		}

		res.push(
			<Message
				messageActions={() => {
					if (messageActions) {
						return messageActions(msg)
					}
					return null
				}}
				key={msg.id}
				self={msg.self}
				content={msg.content}
				user={showUser && msg.user}
				messageUser={messageUser}
				timeDisplay={timeDisplay}
				imageLoadedCb={imageLoadedCb}
			/>
		)
		lastMsg = msg
	})
	return (
		<div className="sp-conversation" ref={bodyRef} style={{ ...bodyStyle }}>
			{res}
		</div>
	)
}
export default Conversation
