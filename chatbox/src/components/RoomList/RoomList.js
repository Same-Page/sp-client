import "./RoomList.css"
import React, { useState, useEffect } from "react"

import {
	LoadingOutlined,
	TeamOutlined,
	PlayCircleFilled
} from "@ant-design/icons"
import FloatingAlert from "components/Alert/FloatingAlert"

const roomColorCache = {}
function getRandomRolor(roomId) {
	if (roomId in roomColorCache) {
		return roomColorCache[roomId]
	}
	var letters = "0123456789".split("")
	var color = "#"
	for (var i = 0; i < 6; i++) {
		color += letters[Math.round(Math.random() * 10)]
	}
	roomColorCache[roomId] = color
	return color
}

function RoomList({ joinRoom, getRooms, listStyle }) {
	const [loadingRooms, setLoadingRooms] = useState(false)
	// rooms here mean room list returned from backend
	// do not confuse with state.rooms
	const [rooms, setRooms] = useState([])

	useEffect(() => {
		setLoadingRooms(true)
		getRooms()
			.then(resp => {
				// resp.data.sort((a, b) => {
				// 	return b.userCount - a.userCount
				// })

				// resp.data.forEach(r => {
				// 	r.id = r.id.toString()
				// })
				setRooms(resp.data)
			})
			.catch(err => {})
			.then(() => {
				setLoadingRooms(false)
			})
	}, [getRooms])

	return (
		<>
			<div
				style={{
					padding: 0,
					overflow: "auto"
					// background: "#e6d8d8"
				}}
				className={listStyle ? "sp-rooms-list-view" : ""}
			>
				{loadingRooms && (
					<FloatingAlert
						text="载入房间列表中。。。"
						type="warning"
						icon={<LoadingOutlined />}
					/>
				)}
				{!loadingRooms && rooms.length === 0 && (
					<div style={{ margin: 15 }}>没有房间可以进入。</div>
				)}

				{rooms.map(r => {
					let color = r.color
					if (!color) {
						color = getRandomRolor(r.id)
						r.color = color
					}
					const style = {
						backgroundColor: color
						// backgroundColor: "white"
					}
					if (r.cover) {
						style.backgroundImage = `url('${r.cover}')`
					}
					return (
						<div
							title={r.about}
							key={r.id}
							onClick={() => {
								joinRoom(r)
							}}
							className="sp-discover-entry"
							style={style}
						>
							<div className="sp-room-wrapper">
								<div>
									<span>{r.name}</span>
									<br />
									<TeamOutlined style={{ marginRight: 3 }} />
									{r.userCount}
									<br />
									<b>
										{r.media && <PlayCircleFilled style={{ marginRight: 3 }} />}
										{r.title}
									</b>
								</div>
							</div>
						</div>
					)
				})}
				<br />
				<br />
			</div>
		</>
	)
}

export default RoomList
