import React from "react"
import { Button } from "antd"
import { LeftOutlined } from "@ant-design/icons"

import RoomList from "components/RoomList"
import Header from "components/Header"
import { getRooms } from "Tab/Chat/service"

function Rooms({ back, account, url, domain }) {
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
				listStyle={true}
				joinRoom={room => {
					var event = new CustomEvent("join_room", { detail: room })
					window.dispatchEvent(event)
				}}
				getRooms={() => {
					return getRooms(url, domain, account.id)
				}}
				userId={account.id}
			/>
		</>
	)
}

export default Rooms
