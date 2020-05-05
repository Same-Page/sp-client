import React from "react"
import "./RoomTab.css"

import RoomList from "./RoomList"

function RoomTab({ room, paneIndex, setRoom }) {
	if (!room) {
		return <RoomList setRoom={setRoom} paneIndex={paneIndex} />
	}
	return (
		<div>
			<div>content</div>
		</div>
	)
}

export default RoomTab
