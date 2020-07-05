import React, { useState, useEffect } from "react"

import Room from "./Room"
import { postMsgToIframe } from "utils/iframe"

import storageManager from "storage"

function Rooms({ storageData, socket, setUserCount, setRoomName, userId }) {
	const [rooms, setRooms] = useState([])
	const [activeRoomId, setActiveRoomId] = useState()
	const [showAvatar, setShowAvatar] = useState(false)

	useEffect(() => {
		const handler = (e) => {
			if (!e || !e.data) return
			const data = e.data
			if (data.name === "get_settings") {
				postMsgToIframe("show_avatar", showAvatar)
			}
		}
		window.addEventListener("message", handler)
		return () => {
			window.removeEventListener("message", handler)
		}
	}, [showAvatar])
	useEffect(() => {
		storageManager.addEventListener("activeRoomId", (activeRoomId) => {
			setActiveRoomId(activeRoomId)
		})
		storageManager.addEventListener("showAvatar", (showAvatar) => {
			setShowAvatar(showAvatar)
			postMsgToIframe("show_avatar", showAvatar)
		})
		storageManager.addEventListener("rooms", (rooms) => {
			setRooms(rooms)
		})
		if (storageData) {
			if (storageData.rooms) {
				let activeRoomId = storageData.activeRoomId
				if (!activeRoomId && storageData.rooms.length > 0) {
					activeRoomId = storageData.rooms[0].id
				}
				storageData.rooms.forEach((r) => {
					const isActive = r.id.toString() === activeRoomId.toString()
					let roomIdUpdated = false
					if (r.type === "page") {
						r.id = window.location.href
						roomIdUpdated = true
					} else if (r.type === "site") {
						r.id = window.location.hostname
						roomIdUpdated = true
					}
					if (roomIdUpdated && isActive) {
						activeRoomId = r.id
					}
				})

				setRooms(storageData.rooms)

				setActiveRoomId(activeRoomId)
			}
			if (storageData.showAvatar != null) {
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
					userId={userId}
					storageData={storageData}
					showAvatar={showAvatar}
					activeRoomId={activeRoomId}
					setActiveRoomId={setActiveRoomId}
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
