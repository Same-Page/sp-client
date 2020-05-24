import "./RoomTab.css"

import React, { useState, useEffect } from "react"
import { connect } from "react-redux"

import { message, Button, Popover } from "antd"
import { LogoutOutlined, TeamOutlined, HomeOutlined } from "@ant-design/icons"

import InputWithPicker from "components/InputWithPicker"
import RoomInfoModal from "components/RoomInfoModal"
import Conversation from "components/Conversation"
import Header from "components/Header"
import LoadingAlert from "components/Alert/LoadingAlert"

import Users from "./Users"
import storageManager from "storage"

import { messageUser } from "redux/actions"
import FloatingAlert from "components/Alert/FloatingAlert"

const MESSAGE_TIME_GAP = 500
let lastMsgTime = 0

function RoomTab({
	socket,
	connected,
	account,
	room,
	exit,
	extraButton,
	messageUser,
	active
}) {
	const [messages, setMessages] = useState([])
	const [joining, setJoining] = useState(false)
	const [joined, setJoined] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [users, setUsers] = useState([])
	const [showUsers, setShowUsers] = useState(false)

	useEffect(() => {
		// if (!socket) {
		// 	setUsers([])
		// 	return
		// }
		if (socket && connected && account && room) {
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

				if (msg.roomId !== room.id) return
				const data = msg.data
				if (msg.error) {
					setJoining(false)

					if (msg.error === 401) {
						storageManager.set("account", null)
						setUsers([])
					}
					// message.error("没有登录")
				} else if (msg.name === "chat message") {
					// TODO: mark self can be done on server
					data.self =
						account && data.user.id.toString() === account.id.toString()
					setMessages(prevMessages => {
						return [...prevMessages, data]
					})
				} else if (msg.name === "room info") {
					setJoining(false)
					setJoined(true)
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
						roomId: room.id,
						token: account && account.token
					}
				}
				socket.send(JSON.stringify(socketPayload))
			}
		} else {
			setUsers([])
		}
	}, [room, socket, account, connected])

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
		<div className="sp-flex-body  sp-room-tab">
			<RoomInfoModal
				room={room}
				showModal={showModal}
				setShowModal={setShowModal}
				messageUser={messageUser}
			/>
			<Header
				leftItems={
					<>
						{extraButton}
						<Button
							className="sp-room-name"
							onClick={() => {
								setShowModal(true)
							}}
							icon={<HomeOutlined />}
						>
							<span>{room.name}</span>
						</Button>
					</>
				}
				rightItems={
					<>
						<Popover
							onVisibleChange={setShowUsers}
							visible={showUsers}
							overlayClassName="sp-room-users-popover"
							content={
								<Users
									users={users}
									messageUser={u => {
										messageUser(u)
										setShowUsers(false)
									}}
								/>
							}
							trigger="click"
							title="在线用户"
						>
							<Button icon={<TeamOutlined />}>
								<span>{users.length}</span>
							</Button>
						</Popover>
						{/* <Popconfirm
							onConfirm={exit}
							title="确认离开？"
							okText="是的"
							cancelText="取消"
							placement="bottomRight"
							okButtonProps={{ danger: true }}
						>
							<Button danger title="离开房间" icon={<LogoutOutlined />}>
								<span>离开</span>
							</Button>
						</Popconfirm> */}
						<Button
							danger
							onClick={exit}
							title="离开房间"
							icon={<LogoutOutlined />}
						>
							<span>离开</span>
						</Button>
					</>
				}
			/>

			{joining && <LoadingAlert text="连接中。。。" />}

			<Conversation
				backgroundColor="rgb(246, 249, 252)"
				messageUser={messageUser}
				messages={messages}
				background={room.background}
			/>
			{!account && <FloatingAlert text={"请先登录"} />}
			{active && account && <InputWithPicker autoFocus={true} send={send} />}
		</div>
	)
}

export default connect(null, {
	messageUser
})(RoomTab)
