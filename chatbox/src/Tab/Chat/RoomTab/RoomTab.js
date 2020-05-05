import React, { useState, useRef, useEffect } from "react"
import "./RoomTab.css"

import moment from "moment"
import { message } from "antd"
import { LogoutOutlined } from "@ant-design/icons"

import Message from "Tab/Message"
import InputWithPicker from "Tab/InputWithPicker"
import { joinRoom, sendMessage } from "socket"

const AUTO_SCROLL_TRESHOLD_DISTANCE = 300
const MESSAGE_TIME_GAP = 2 * 1000
let lastMsgTime = 0

const chatBodyStyle = {
	// height: "calc(100% - 114px)",
	overflowY: "auto",
	overflowX: "hidden",
	minHeight: 300,
	width: "100%",
	// position: "fixed",
	background: "rgb(243, 243, 243)",
	padding: 10,
	paddingBottom: 50,
	scrollBehavior: "smooth"
}

function RoomTab({ room, exit }) {
	useEffect(() => {
		console.log("join room " + room.name)
		joinRoom(room)
		// TODO: show joining spinner
		return () => {
			// TODO: leave room
			console.log("remove room " + room.name)
		}
	}, [room])

	const [messages, setMessages] = useState([])
	const bodyRef = useRef(null)
	const bodyStyle = { ...chatBodyStyle }

	const imageLoadedCb = () => {
		scrollToBottomIfNearBottom(10)
	}
	const scrollToBottomIfNearBottom = timeout => {
		const bodyDiv = bodyRef.current
		if (!bodyDiv) return
		if (
			bodyDiv.scrollHeight - bodyDiv.scrollTop - bodyDiv.offsetHeight <
			AUTO_SCROLL_TRESHOLD_DISTANCE
		) {
			scrollToBottom(timeout)
		}
	}
	const scrollToBottom = timeout => {
		const bodyDiv = bodyRef.current
		if (!bodyDiv) return
		timeout = timeout || 100

		setTimeout(() => {
			bodyDiv.scrollTop = bodyDiv.scrollHeight
		}, timeout)
	}
	let res = []
	let lastMsg = null
	messages.forEach(msg => {
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
			if (msg.time.diff(lastMsg.time) > 5 * 60 * 1000) {
				showTimestamp = true
				showUser = true
			}
		} else {
			showTimestamp = true
			showUser = true
		}

		if (showTimestamp) {
			if (moment().diff(msg.time) > 24 * 60 * 60 * 1000)
				timeDisplay = msg.time.local().format("MMMDo HH:mm")
			else timeDisplay = msg.time.local().format("HH:mm")
		}

		res.push(
			<Message
				showMenu={true}
				withHoverCard={false}
				key={msg.id}
				data={msg}
				room={room}
				showUser={showUser}
				timeDisplay={timeDisplay}
				imageLoadedCb={imageLoadedCb}
			/>
		)
		lastMsg = msg
	})

	const send = payload => {
		const now = new Date()
		if (payload.type === "file" || now - lastMsgTime > MESSAGE_TIME_GAP) {
			lastMsgTime = now

			const data = {
				id: Math.ceil(Math.random() * 100000),
				roomType: "site",
				roomId: room.id,
				content: payload
			}
			console.debug(data)
			sendMessage(data)

			return true
		} else {
			message.warn("您慢点儿")
			return false
		}
	}

	return (
		<div>
			<div className="sp-tab-header">
				<LogoutOutlined onClick={exit} />
			</div>

			<div ref={bodyRef} style={{ ...bodyStyle }}>
				{res}
			</div>

			<InputWithPicker send={send} />
		</div>
	)
}

export default RoomTab
