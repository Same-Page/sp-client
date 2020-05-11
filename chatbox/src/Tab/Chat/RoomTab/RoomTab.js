import React, { useState, useRef, useEffect } from "react"
import "./RoomTab.css"

import moment from "moment"
import { message, Button, Alert, Popover, Popconfirm } from "antd"
import {
	LogoutOutlined,
	LoadingOutlined,
	TeamOutlined,
	HomeOutlined
} from "@ant-design/icons"

import InputWithPicker from "components/InputWithPicker"
import RoomInfoModal from "components/RoomInfoModal"
import Conversation from "components/Conversation"
import Users from "./Users"

const MESSAGE_TIME_GAP = 2 * 1000
let lastMsgTime = 0

function RoomTab({ socket, account, room, exit, extraButton }) {
	const [messages, setMessages] = useState([])
	const [joining, setJoining] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [users, setUsers] = useState([])

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
				// TODO: mark self can be done on server
				data.self = account && data.user.id.toString() === account.id.toString()
				setMessages(prevMessages => {
					return [...prevMessages, data]
				})
			} else if (msg.name === "room info") {
				setJoining(false)
				if (data.chatHistory) {
					data.chatHistory.forEach(msg => {
						// TODO: mark self can be done on server
						msg.self =
							account && msg.user.id.toString() === account.id.toString()
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
			<Conversation messages={messages} />
			{socket && <InputWithPicker autoFocus={true} send={send} />}
		</div>
	)
}

export default RoomTab
