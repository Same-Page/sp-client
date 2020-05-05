import React, { useState } from "react"
import "./Chat.css"

import { Tabs, Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"

import RoomTab from "./RoomTab"
import RoomList from "Tab/RoomList"

const { TabPane } = Tabs

const initPanes = [
	{ title: "请选择房间 1", key: "1" },
	{ title: "请选择房间 2", key: "2" }
]

let newTabIndex = 0

function Chat() {
	const [panes, setPanes] = useState(initPanes)
	const [activeKey, setActiveKey] = useState(initPanes[0].key)

	const onChange = activeKey => {
		setActiveKey(activeKey)
	}

	const add = () => {
		const key = `newTab${newTabIndex++}`
		panes.push({ title: "选择房间", key: key })
		setPanes(panes)
		setActiveKey(key)
	}

	const remove = targetKey => {
		let lastIndex
		panes.forEach((pane, i) => {
			if (pane.key === targetKey) {
				lastIndex = i - 1
			}
		})
		const newPanes = panes.filter(pane => pane.key !== targetKey)
		if (newPanes.length && activeKey === targetKey) {
			// Update activeKey if removed the active pane
			// Use the pane before or after if no before ones
			let newActiveKey = -1
			if (lastIndex >= 0) {
				newActiveKey = newPanes[lastIndex].key
			} else {
				newActiveKey = newPanes[0].key
			}
			setActiveKey(newActiveKey)
		}
		setPanes(newPanes)
	}
	const onEdit = (targetKey, action) => {
		if (action === "add") {
			add(targetKey)
		} else if (action === "remove") {
			remove(targetKey)
		} else {
			console.error(action)
		}
	}
	const setRoom = (room, paneIndex) => {
		// If room already open, set it to be active
		const existingPane = panes.filter(
			pane => pane.room && pane.room.id === room.id
		)
		if (existingPane.length) {
			setActiveKey(existingPane[0].key)
			return
		}

		const pane = {
			title: room.name,
			room: room,
			key: panes[paneIndex].key
		}
		panes[paneIndex] = pane
		console.log(panes)
		setPanes([...panes])
	}

	return (
		<div>
			{/* <div className="sp-tab-header">{"实时聊天"}</div> */}

			<div className="sp-chat-tabs">
				<Tabs
					tabBarExtraContent={
						<Button
							// type="primary"
							onClick={add}
						>
							<PlusOutlined />
						</Button>
					}
					hideAdd
					onChange={onChange}
					activeKey={activeKey}
					// type="editable-card" commented out otherwise style is a mess
					onEdit={onEdit}
					tabPosition="left"
				>
					{panes.map((pane, paneIndex) => (
						<TabPane tab={pane.title} key={pane.key}>
							<div className="sp-room-tab">
								{!pane.room && (
									<RoomList
										setRoom={room => {
											setRoom(room, paneIndex)
										}}
									/>
								)}

								{pane.room && (
									<RoomTab
										room={pane.room}
										exit={() => {
											remove(pane.key)
										}}
									/>
								)}
							</div>
						</TabPane>
					))}
				</Tabs>
			</div>
		</div>
	)
}

export default Chat
