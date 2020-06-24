import React, { useState, useEffect } from "react"
import ChatIcon from "../ChatIcon"

function Rooms({ storageData, socket }) {
	const [rooms, setRooms] = useState([])
	const [selectedRoom, setSelectedRoom] = useState()
	useEffect(() => {
		if (storageData && storageData.rooms) {
			setRooms(storageData.rooms)

			if (storageData.rooms.length > 0) {
				setSelectedRoom(storageData.rooms[0])
			}
		}
	}, [storageData])

	useEffect(() => {
		if (socket && rooms) {
			rooms.forEach((room) => {
				const socketPayload = {
					action: "join_room",
					data: {
						roomId: room.id,
					},
				}
				socket.send(JSON.stringify(socketPayload))
			})

			return () => {
				rooms.forEach((room) => {
					const socketPayload = {
						action: "leave_room",
						data: {
							roomId: room.id,
						},
					}
					socket.send(JSON.stringify(socketPayload))
				})
			}
		}
	}, [rooms, socket])

	return (
		<>
			{selectedRoom && selectedRoom.name}
			<ChatIcon userCount={7} />
		</>
	)
}

export default Rooms
