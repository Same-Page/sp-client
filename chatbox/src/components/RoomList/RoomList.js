import "./RoomList.css"
import React, { useState, useEffect } from "react"

import { Modal, Alert } from "antd"
import {
	LoadingOutlined,
	TeamOutlined,
	PlayCircleFilled
} from "@ant-design/icons"

// import CreateRoomForm from "./CreateRoom"
import { getRooms } from "./service"

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
const title = (
	<span>
		创建房间<span style={{ color: "gray" }}>（需10积分）</span>
	</span>
)
function RoomList({ joinRoom }) {
	const [loadingRooms, setLoadingRooms] = useState(false)
	// rooms here mean room list returned from backend
	// do not confuse with state.rooms
	const [rooms, setRooms] = useState([])
	const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)

	const loadRooms = user => {
		setLoadingRooms(true)

		const params = {}
		if (user) {
			params["userId"] = user.id
		}
		getRooms(params)
			.then(resp => {
				resp.data.sort((a, b) => {
					return b.userCount - a.userCount
				})

				resp.data.forEach(r => {
					r.id = r.id.toString()
				})
				setRooms(resp.data)
			})
			.catch(err => {})
			.then(() => {
				setLoadingRooms(false)
			})
	}

	useEffect(() => {
		loadRooms()
	}, [])

	return (
		<>
			<div
				style={{
					padding: 0,
					overflow: "auto"
					// background: "#e6d8d8"
				}}
				className="sp-tab-body discovery"
			>
				{loadingRooms && (
					<Alert
						className="sp-room-alert sp-alert-float"
						message={
							<span style={{ marginLeft: 10 }}>载入房间列表中。。。</span>
						}
						icon={<LoadingOutlined />}
						banner
						type="warning"
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

			<Modal
				transitionName="none"
				title={title}
				centered
				visible={showCreateRoomModal}
				onCancel={() => {
					setShowCreateRoomModal(false)
				}}
				footer={null}
				wrapClassName="sp-modal"
			></Modal>
		</>
	)
}

export default RoomList
