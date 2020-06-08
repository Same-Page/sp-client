import React, { useState } from "react"
import { connect } from "react-redux"
import { Button } from "antd"
import { LeftOutlined, SaveOutlined } from "@ant-design/icons"

import { setActiveTab } from "redux/actions"
import RoomList from "components/RoomList"
import Header from "components/Header"
import { getRooms } from "Tab/Chat/service"

function Rooms({ back, account, setActiveTab }) {
	return (
		<>
			<Header
				leftItems={
					<>
						<Button icon={<LeftOutlined />} onClick={back} />
					</>
				}
				centerItems={<>房间 {account.roomCount}</>}
			/>
			<RoomList
				joinRoom={room => {
					var event = new CustomEvent("join_room", { detail: room })
					window.dispatchEvent(event)
					setActiveTab("chat")
				}}
				getRooms={getRooms}
				userId={account.id}
			/>
		</>
	)
}

export default connect(null, {
	setActiveTab
})(Rooms)
