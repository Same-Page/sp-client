import React, { useState, useEffect } from "react"

import Room from "./Room"
import storageManager from "storage"

function Rooms({ storageData, socket, setUserCount, setRoomName }) {
	const [rooms, setRooms] = useState([])
	const [activeRoomId, setActiveRoomId] = useState()
	const [showAvatar, setShowAvatar] = useState(false)
	useEffect(() => {
		storageManager.addEventListener("activeRoomId", (activeRoomId) => {
			setActiveRoomId(activeRoomId)
		})
		storageManager.addEventListener("showAvatar", (showAvatar) => {
			setShowAvatar(showAvatar)
		})
		storageManager.addEventListener("rooms", (rooms) => {
			setRooms(rooms)
		})
		if (storageData) {
			if (storageData.rooms) {
				setRooms(storageData.rooms)

				if (storageData.activeRoomId) {
					setActiveRoomId(storageData.activeRoomId)
				} else {
					if (storageData.rooms.length > 0) {
						setActiveRoomId(storageData.rooms[0].id)
					}
				}
			}
			if (storageData.showAvatar) {
				setShowAvatar(storageData.showAvatar)
			}
		}
	}, [storageData])

	useEffect(() => {
		if (rooms && activeRoomId) {
			rooms.forEach((r) => {
				if (r.id.toString() === activeRoomId.toString()) {
					setRoomName(r.name)
				}
			})
		}
	}, [activeRoomId, rooms])

	return (
		<>
			{/* {!activeRoomId && <ChatIcon storageData={storageData} />} */}

			{rooms.map((r) => (
				<Room
					storageData={storageData}
					showAvatar={showAvatar}
					activeRoomId={activeRoomId}
					key={r.id}
					socket={socket}
					room={r}
					setUserCount={setUserCount}
					setRoomName={setRoomName}
				/>
			))}
		</>
	)
}

export default Rooms
