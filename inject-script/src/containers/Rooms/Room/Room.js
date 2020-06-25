import React, { useState, useEffect } from "react"
import Draggable from "react-draggable"

import config from "config"

import User from "./User"
import ChatIcon from "containers/ChatIcon"

function Room({ socket, room, activeRoomId }) {
	const [users, setUsers] = useState([])
	const [forbiddenToJoin, setFobbidenToJoin] = useState(false)

	const userId = 123
	useEffect(() => {
		if (socket && !forbiddenToJoin) {
			let lastGoodHeartbeat = 0
			const joinRoom = () => {
				console.debug("joining room " + room.name)
				const socketPayload = {
					action: "join_room",
					data: {
						roomId: room.id,
					},
				}
				socket.send(JSON.stringify(socketPayload))
			}
			joinRoom()

			// register event listeners for this room
			const socketMessageHandler = (e) => {
				const msg = JSON.parse(e.data)

				if (msg.roomId !== room.id) return
				const data = msg.data
				if (msg.error) {
					if (msg.error === "forbidden" && msg.name === "join_room") {
						setFobbidenToJoin(true)
					}
				} else if (msg.name === "chat_message") {
					data.self = data.user.id.toString() === userId.toString()
					window.queueDanmu(data)
					setUsers((users) => {
						const newUsers = [...users]
						newUsers.forEach((u) => {
							if (u.id.toString() === data.user.id.toString()) {
								u.message = data.content.value
							}
						})
						return newUsers
					})
				} else if (msg.name === "delete_message") {
					// TODO: instantly delete message bubble
				} else if (msg.name === "room_info") {
					lastGoodHeartbeat = new Date()
					data.chatHistory.forEach((msg) => {
						msg.self = msg.user.id.toString() === userId.toString()
					})
					setUsers(data.users)
				} else if (msg.name === "other_join") {
					setUsers((users) => {
						const user = msg.user
						// in case of duplicate
						const existingUsersWithoutNewUser = users.filter(
							(u) => {
								return u.id.toString() !== user.id.toString()
							}
						)
						return [...existingUsersWithoutNewUser, user]
					})
				} else if (msg.name === "self_kicked") {
					setFobbidenToJoin(true)
				} else if (
					msg.name === "other_left" ||
					msg.name === "user_kicked"
				) {
					const user = msg.user
					setUsers((users) => {
						return users.filter((u) => {
							return u.id.toString() !== user.id.toString()
						})
					})
				} else if (msg.name === "heartbeat") {
					if (msg.success) {
						lastGoodHeartbeat = new Date()
					} else {
						joinRoom()
						console.warn(
							`[${room.name}] heartbeat failed`,
							msg.error
						)
					}
				}
			}

			socket.addEventListener("message", socketMessageHandler)

			// heartbeat to ensure connection on both client and server ends
			// TODO: frequent heartbeat can waste bandwidth, should have less
			// frequent heartbeat for room not active/open
			// TODO: if the browser tab is not visible or active, also pause
			// heartbeat
			const intervalId = setInterval(() => {
				const timeSinceLastGoodHeartbeat =
					new Date() - lastGoodHeartbeat
				if (timeSinceLastGoodHeartbeat > 2 * config.heartbeatInterval) {
					console.warn(
						"last good heartbeat is too old, kill socket",
						timeSinceLastGoodHeartbeat
					)
					// socket.close() wouldn't work right away because it waits
					// backend to properly close the connection
					socket.dispatchEvent(new CustomEvent("close", {}))
				} else {
					const socketPayload = {
						action: "heartbeat",
						data: {
							roomId: room.id,
						},
					}
					socket.send(JSON.stringify(socketPayload))
				}
			}, config.heartbeatInterval)

			return () => {
				console.debug("leave room " + room.name)
				socket.removeEventListener("message", socketMessageHandler)
				if (!socket.closed) {
					const socketPayload = {
						action: "leave_room",
						data: {
							roomId: room.id,
						},
					}
					socket.send(JSON.stringify(socketPayload))
				}
				clearInterval(intervalId)
			}
		} else {
			setUsers([])
		}
	}, [socket, forbiddenToJoin])

	return (
		<>
			{activeRoomId === room.id.toString() && (
				<>
					<Draggable>
						<span title={room.name} className="sp-users-wrapper">
							{/* {room.name} */}

							{users.map((user) => (
								<User key={user.id} user={user} />
							))}
						</span>
					</Draggable>
					<ChatIcon userCount={users.length} />
				</>
			)}
		</>
	)
}

export default Room
