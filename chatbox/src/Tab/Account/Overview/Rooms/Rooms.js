import React, { useCallback } from "react"
import { Button } from "antd"
import { LeftOutlined } from "@ant-design/icons"

import RoomList from "components/RoomList"
import Header from "components/Header"
import { getRooms } from "Tab/Chat/service"

function Rooms({ back, account, url, domain }) {
	const getUserRooms = useCallback(() => {
		return getRooms(url, domain, account.id)
	}, [url, domain, account.id])
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
				getRooms={getUserRooms}
				userId={account.id}
			/>
		</>
	)
}

export default Rooms
