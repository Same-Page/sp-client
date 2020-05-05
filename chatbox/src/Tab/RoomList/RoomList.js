import "./RoomList.css"
import React, { useState, useEffect } from "react"

import { Modal, Button } from "antd"
import {
	ArrowLeftOutlined,
	ReloadOutlined,
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
function RoomList({ back, showCreateRoomBtn, setRoom }) {
	const [loadingRooms, setLoadingRooms] = useState(false)
	// rooms here mean room list returned from backend
	// do not confuse with state.rooms
	const [rooms, setRooms] = useState([])
	const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)
	let headerTitle = "房间列表"

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
		<span>
			<div>
				{false && (
					<div className="sp-tab-header">
						{back && (
							<Button onClick={back} size="small" className="sp-back-btn">
								<ArrowLeftOutlined />
							</Button>
						)}
						{!back && loadingRooms && (
							<Button size="small" className="sp-back-btn">
								<LoadingOutlined />
							</Button>
						)}
						{/* {!back && !loadingRooms && (
						<Button size="small" onClick={loadRooms} className="sp-back-btn">
							{" "}
							<ReloadOutlined />
						</Button>
					)} */}
						<span>{headerTitle}</span>
						{/* {showCreateRoomBtn && (
						<span style={{ position: "absolute", right: 10 }}>
							<Button
								type="primary"
								icon="plus"
								size="small"
								onClick={() => {
									setShowCreateRoomModal(true)
								}}
							>
								创建房间
							</Button>
						</span>
					)} */}
					</div>
				)}
				<div
					style={{
						padding: 0
						// background: "#e6d8d8"
					}}
					className="sp-tab-body discovery"
				>
					{back && loadingRooms && (
						<LoadingOutlined
							style={{
								margin: "auto",
								marginTop: 30,
								marginBottom: 30,
								display: "block"
							}}
						/>
					)}
					{!loadingRooms && rooms.length === 0 && (
						<center style={{ margin: 20 }}>无</center>
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
									setRoom(r)
									//   joinManMadeRoom(r)
									//   // setDiscoveryRoom(r)
									//   socketManager.joinRoom(r)
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
											{r.media && (
												<PlayCircleFilled style={{ marginRight: 3 }} />
											)}
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
			</div>

			<Modal
				transitionName="none"
				title={title}
				visible={showCreateRoomModal}
				onCancel={() => {
					setShowCreateRoomModal(false)
				}}
				footer={null}
				wrapClassName="sp-modal"
			>
				{/* <CreateRoomForm
          back={() => {
            setShowCreateRoomModal(false)
          }}
          afterUpdateCb={loadRooms}
        /> */}
			</Modal>
		</span>
	)
}

export default RoomList
