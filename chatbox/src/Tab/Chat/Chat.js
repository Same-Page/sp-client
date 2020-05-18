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
import { url, domain } from "utils"
import storageManager from "storage"

const { TabPane } = Tabs

const getPanesFromRooms = rooms => {
	const res = rooms.map(r => {
		// dynamic room id for site/page type of room
		if (r.type === "site") {
			r.id = domain
		} else if (r.type === "page") {
			r.id = url
		}
		return {
			title: r.name,
			room: r,
			key: r.id
		}
	})
	return res
}

const getInitialPanes = storageData => {
	// merge rooms from config and localStorage
	// return array of panes
	let res = []
	if (storageData.rooms) {
		res = getPanesFromRooms(storageData.rooms)
	} else {
		res = getPanesFromRooms(config.defaultRooms)
	}
	return res
}

const getInitialActiveKey = (initPanes, storageData) => {
	// check if localstorage store an active room id
	// and it's within the initPanes array, if not, select
	// the first pane key
	if (initPanes.length === 0) return null
	const keyFromStorage = storageData.activeRoomId
	if (keyFromStorage) {
		const paneWithKey = initPanes.find(p => {
			return p.key === keyFromStorage
		})
		if (paneWithKey) {
			return keyFromStorage
		}
	}
	return initPanes[0].key
}

// newTabIndex is used as pane key, could just use room id instead
// but empty new tab doesn't have room assigned, could use -1 but
// user can open multiple empty tabs
let newTabIndex = 0

function Chat({ account, storageData }) {
	const initPanes = getInitialPanes(storageData)
	const [panes, setPanes] = useState(initPanes)
	const [activeKey, setActiveKey] = useState(
		getInitialActiveKey(initPanes, storageData)
	)
	const [socket, setSocket] = useState(null)
	const [minSideBar, setMinSideBar] = useState(initPanes.length > 0)
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

	useEffect(() => {
		// record which rooms are open and save in localStorage
		const rooms = panes.reduce((res, p) => {
			if (p.room) {
				res.push(p.room)
			}
			return res
		}, [])
		storageManager.set("rooms", rooms)
	}, [panes])

	useEffect(() => {
		// record which rooms is open in localStorage
		// Note this includes non room id like pane index
		// and dynamic room id like url
		storageManager.set("activeRoomId", activeKey)
	}, [activeKey])

	const onChange = activeKey => {
		setActiveKey(activeKey)
	}

	const add = () => {
		const key = `newTab${newTabIndex++}`

		setPanes([...panes, { title: "选择房间", key: key }])
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
		// build a new pane to replace the old pane
		// keep the same old key? NO
		const pane = {
			title: room.name,
			room: room,
			key: room.id
			// key: panes[paneIndex].key
		}
		console.log(pane)
		panes[paneIndex] = pane
		setActiveKey(room.id)
		setPanes([...panes])
	}

	const wrapperClassName =
		"sp-chat-tab" +
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
						forceRender
						tab={
							<TabName
								minimized={minSideBar}
								// iconUrl={minSideBar && pane.room && pane.room.cover}
								title={pane.title}
							/>
						}
						key={pane.key}
					>
						{!pane.room && (
							<div className="sp-flex-body">
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
							</div>
						)}

						{pane.room && (
							<RoomTab
								extraButton={
									closeSideBar && (
										<Button
											onClick={() => {
												setCloseSideBar(false)
												// setMinSideBar(false)
											}}
										>
											<MenuOutlined />
											{/* <span>列表</span> */}
										</Button>
									)
								}
								socket={socket}
								account={account}
								room={pane.room}
								exit={() => {
									// setMinSideBar(false)
									setCloseSideBar(false)
									remove(pane.key)
								}}
							/>
						)}
					</TabPane>
				))}
			</Tabs>
		</div>
	)
}

export default Chat
