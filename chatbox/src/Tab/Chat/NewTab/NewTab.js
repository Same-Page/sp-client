import React, { useState } from "react"
import { Tabs, Button, message } from "antd"
import {
	PlusOutlined,
	LeftOutlined,
	CloseOutlined,
	MenuOutlined
} from "@ant-design/icons"

import RoomList from "components/RoomList"
import Header from "components/Header"
import CreateRoom from "./CreateRoom"

function NewTab({ close, joinRoom }) {
	const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)
	return (
		<>
			<CreateRoom
				joinRoom={joinRoom}
				showCreateRoomModal={showCreateRoomModal}
				setShowCreateRoomModal={setShowCreateRoomModal}
			/>
			<div className="sp-flex-body">
				<Header
					leftItems={<span style={{ marginLeft: 10 }}>房间列表</span>}
					rightItems={
						<>
							<Button
								onClick={() => {
									setShowCreateRoomModal(true)
								}}
								icon={<PlusOutlined />}
							>
								新建
							</Button>
							<Button onClick={close} icon={<CloseOutlined />}>
								关闭
							</Button>
						</>
					}
				/>

				<RoomList joinRoom={joinRoom} />
			</div>
		</>
	)
}

export default NewTab
