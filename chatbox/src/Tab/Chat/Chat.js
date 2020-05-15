import React, { useState, useEffect } from "react"
import "./Chat.css"

import { Tabs, Button, message } from "antd"
import {
	PlusOutlined,
	LeftOutlined,
	CloseOutlined,
	MenuOutlined
} from "@ant-design/icons"
import config from "config"
import TabName from "components/TabName"
import RoomList from "components/RoomList"
import Header from "components/Header"
import RoomTab from "./RoomTab"

const { TabPane } = Tabs

const initPanes = [
	{ title: "请选择房间 1", key: "1" },
	{ title: "请选择房间 2", key: "2" }
]

// newTabIndex is used as pane key, could just use room id instead
// but empty new tab doesn't have room assigned, could use -1 but
// user can open multiple empty tabs
let newTabIndex = 0

function Chat({ account }) {
	const [panes, setPanes] = useState(initPanes)
	const [activeKey, setActiveKey] = useState(initPanes[0].key)
	const [socket, setSocket] = useState(null)
	const [minSideBar, setMinSideBar] = useState(false)
	const [closeSideBar, setCloseSideBar] = useState(false)
	useEffect(() => {
		const createSocket = () => {
			console.debug("creating socket")
			const s = new WebSocket(config.socketUrl)
			s.addEventListener("open", function (event) {
				console.debug("socket connected")
				// message.success("聊天服务器连接成功！")
				setSocket(s)
				s.wasWorking = true
			})
			s.addEventListener("close", e => {
				if (s.wasWorking) {
					// Also get this callback if fail to open
					// only show error message connection break
					message.error("聊天服务器连接断开！")
				}

				console.debug("socket closed, recreate in 5 seconds...")
				setSocket(null)
				setTimeout(createSocket, 5 * 1000)
			})
			// No need to remove open/close listener from s because
			// s will be replaced by a new object when connection close
		}
		createSocket()
		// not writing clean up methods since Chat component
		// should never be unmounted
	}, [])

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
		setPanes([...panes])
	}

	const wrapperClassName =
		"sp-chat-tabs" +
		(minSideBar ? " sp-minimized" : "") +
		(closeSideBar ? " sp-closed" : "")

	return (
		<div className={wrapperClassName}>
			<Tabs
				tabBarExtraContent={
					<span>
						<Button icon={<PlusOutlined />} onClick={add} />
						<br />
						<Button
							onClick={() => {
								setMinSideBar(prev => {
									return !prev
								})
							}}
							icon={
								<LeftOutlined
									className="sp-icon-transition-duration-1"
									rotate={minSideBar ? 180 : 0}
								/>
							}
						/>

						<br />
						<Button
							danger
							onClick={() => {
								setCloseSideBar(true)
							}}
							icon={<CloseOutlined />}
						/>
					</span>
				}
				hideAdd
				onChange={onChange}
				activeKey={activeKey}
				// type="editable-card" commented out otherwise style is a mess
				onEdit={onEdit}
				tabPosition="left"
			>
				{panes.map((pane, paneIndex) => (
					<TabPane
						tab={
							<TabName
								minimized={minSideBar}
								// iconUrl={minSideBar && pane.room && pane.room.cover}
								title={pane.title}
							/>
						}
						key={pane.key}
					>
						<div className="sp-room-tab">
							{!pane.room && (
								<>
									<Header
										leftItems={<span style={{ marginLeft: 10 }}>房间列表</span>}
										rightItems={
											<>
												<Button icon={<PlusOutlined />}>新建</Button>
												<Button
													onClick={() => {
														setCloseSideBar(false)
														remove(pane.key)
													}}
													icon={<CloseOutlined />}
												>
													关闭
												</Button>
											</>
										}
									/>

									<RoomList
										setRoom={room => {
											setRoom(room, paneIndex)
											setMinSideBar(true)
										}}
									/>
								</>
							)}

							{pane.room && (
								<RoomTab
									extraButton={
										closeSideBar && (
											<Button
												onClick={() => {
													setCloseSideBar(false)
													setMinSideBar(false)
												}}
											>
												<MenuOutlined />
												<span>列表</span>
											</Button>
										)
									}
									socket={socket}
									account={account}
									room={pane.room}
									exit={() => {
										setMinSideBar(false)
										setCloseSideBar(false)
										remove(pane.key)
									}}
								/>
							)}
						</div>
					</TabPane>
				))}
			</Tabs>
		</div>
	)
}

export default Chat
