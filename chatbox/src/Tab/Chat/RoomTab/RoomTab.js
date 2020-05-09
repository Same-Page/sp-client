import React, { useState, useRef, useEffect, useCallback } from "react"
import "./RoomTab.css"

import moment from "moment"
import { message, Button, Alert, Popover, Popconfirm } from "antd"
import {
	LogoutOutlined,
	LoadingOutlined,
	TeamOutlined,
	HomeOutlined
} from "@ant-design/icons"

import Message from "Tab/Message"
import InputWithPicker from "Tab/InputWithPicker"
import RoomInfoModal from "Tab/RoomInfoModal/RoomInfoModal"
import Users from "./Users"

const AUTO_SCROLL_TRESHOLD_DISTANCE = 300
const MESSAGE_TIME_GAP = 2 * 1000
let lastMsgTime = 0

const chatBodyStyle = {
	// height: "calc(100% - 114px)",
	overflowY: "auto",
	overflowX: "hidden",
	minHeight: 500,
	maxHeight: 500, // some people may not want to set it
	width: "100%",
	// position: "fixed",
	background: "rgb(243, 243, 243)",
	padding: 10,
	paddingBottom: 50,
	scrollBehavior: "smooth"
}

function RoomTab({ socket, account, room, exit, extraButton }) {
	const bodyStyle = { ...chatBodyStyle }
	if (room.background) {
		bodyStyle.backgroundImage = `url('${room.background}')`
		bodyStyle.backgroundSize = "cover"
	}
	const imageLoadedCb = () => {
		scrollToBottomIfNearBottom(10)
	}

	const [messages, setMessages] = useState([])
	const [joining, setJoining] = useState(false)
	const bodyRef = useRef(null)
	const [showModal, setShowModal] = useState(false)
	const [users, setUsers] = useState([])
	const scrollToBottomIfNearBottom = useCallback(timeout => {
		timeout = timeout || 100

		const bodyDiv = bodyRef.current
		if (!bodyDiv) {
			console.error("no chat body div to scroll to bottom")
			return
		}
		if (
			bodyDiv.scrollHeight - bodyDiv.scrollTop - bodyDiv.offsetHeight <
			AUTO_SCROLL_TRESHOLD_DISTANCE
		) {
			setTimeout(() => {
				bodyDiv.scrollTop = bodyDiv.scrollHeight
			}, timeout)
		}
	}, [])
	useEffect(() => {
		if (!socket) {
			return
		}
		console.log("joining room " + room.name)
		setJoining(true)
		// TODO: set timeout for join
		const socketPayload = {
			action: "join_single",
			data: {
				token: account && account.token,
				room: room
			}
		}
		socket.send(JSON.stringify(socketPayload))

		// register event listeners for this room
		const socketMessageHandler = e => {
			const msg = JSON.parse(e.data)
			const data = msg.data
			if (!data || data.roomId !== room.id) return
			if (msg.name === "chat message") {
				data.self = account && data.user.id.toString() === account.id.toString()
				data.time = moment()
				setMessages(prevMessages => {
					return [...prevMessages, data]
				})
			} else if (msg.name === "room info") {
				setJoining(false)
				if (data.chatHistory) {
					data.chatHistory.forEach(msg => {
						msg.self =
							account && msg.user.id.toString() === account.id.toString()
						msg.time = moment.utc(msg.timestamp)
					})
					setMessages(data.chatHistory)
				}
				if (data.users) {
					setUsers(data.users)
				}
			} else if (msg.name === "other join") {
				setUsers(users => {
					const user = data.user
					// in case of duplicate
					const existingUsersWithoutNewUser = users.filter(u => {
						return u.id.toString() !== user.id.toString()
					})
					return [...existingUsersWithoutNewUser, user]
				})
			} else if (msg.name === "other left") {
				setUsers(users => {
					return users.filter(u => {
						return u.id.toString() !== data.user.id.toString()
					})
				})
			}
		}

		socket.addEventListener("message", socketMessageHandler)

		return () => {
			console.log("leave room " + room.name)
			socket.removeEventListener("message", socketMessageHandler)
			const socketPayload = {
				action: "leave_single",
				data: {
					room: room,
					token: account && account.token
				}
			}
			socket.send(JSON.stringify(socketPayload))
		}
	}, [room, socket, account])
	useEffect(() => {
		scrollToBottomIfNearBottom(10)
	}, [messages.length, scrollToBottomIfNearBottom])
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
				content: payload,
				token: account.token
			}

			const socketPayload = {
				action: "message",
				data: data
			}
			socket.send(JSON.stringify(socketPayload))
			return true
		} else {
			message.warn("您慢点儿")
			return false
		}
	}

	return (
		<div>
			<RoomInfoModal
				room={room}
				showModal={showModal}
				setShowModal={setShowModal}
			/>
			<div className="sp-room-top-bar">
				{extraButton}
				<Button
					onClick={() => {
						setShowModal(true)
					}}
					icon={<HomeOutlined />}
				>
					<span>{room.name}</span>
				</Button>
				<span style={{ float: "right" }}>
					<Popover
						overlayClassName="sp-room-users-popover"
						content={<Users users={users} />}
						trigger="click"
						title="在线用户"
					>
						<Button icon={<TeamOutlined />}>
							<span>{users.length}</span>
						</Button>
					</Popover>
					<Popconfirm
						onConfirm={exit}
						title="确认离开？"
						okText="是的"
						cancelText="取消"
						placement="bottomRight"
						okButtonProps={{ danger: true }}
					>
						{/* don't need a button for clicking, just like its animation, same above */}
						<Button danger title="离开房间" icon={<LogoutOutlined />}>
							<span>离开</span>
						</Button>
					</Popconfirm>
				</span>
				<div style={{ clear: "both" }} />
			</div>

			{(joining || !socket) && (
				<Alert
					className="sp-room-alert sp-alert-float"
					message={<span style={{ marginLeft: 10 }}>连接中。。。</span>}
					icon={<LoadingOutlined />}
					banner
					type="warning"
				/>
			)}
			<div ref={bodyRef} style={{ ...bodyStyle }}>
				{res}
			</div>
			{socket && <InputWithPicker send={send} />}
		</div>
	)
}

export default RoomTab
