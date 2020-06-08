import React, { useState, useEffect, useCallback } from "react"
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
import RoomTab from "./RoomTab"

import storageManager from "storage"
import NewTab from "./NewTab/NewTab"
import { getRooms } from "Tab/Chat/service"

const { TabPane } = Tabs

const getPanesFromRooms = (rooms, url, domain) => {
	const res = rooms.map(r => {
		// dynamic room id for site/page type of room
		if (r.type === "site") {
			r.id = domain
			r.addr = domain
		} else if (r.type === "page") {
			r.id = url
			r.addr = url
		}
		return {
			title: r.name,
			room: r,
			key: r.id
		}
	})
	return res
}

const getInitialPanes = (storageData, url, domain) => {
	// merge rooms from config and localStorage
	// return array of panes
	let res = []
	if (storageData.rooms) {
		res = getPanesFromRooms(storageData.rooms, url, domain)
	} else {
		res = getPanesFromRooms(config.defaultRooms, url, domain)
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

function Chat({ account, storageData, url, domain, setActiveTab }) {
	const initPanes = getInitialPanes(storageData, url, domain)
	// TODO: url change won't trigger any update
	// but maybe user does want to stay in pervious same page chat room
	// low priority, depend on feedbacks

	const [panes, setPanes] = useState(initPanes)
	const [activeKey, setActiveKey] = useState(
		getInitialActiveKey(initPanes, storageData)
	)
	const [socket, setSocket] = useState(null)
	const [connected, setConnected] = useState(false)
	// disconnectCount is a counter that's not updated during connection
	// we need it although we have connected state, because it's only updated
	// during disconnection, so that we can use it to trigger useEffect to
	// createSocket only on disconnection or account change, not when connection established
	const [disconnectCount, setDisconnectCounter] = useState(0)
	const [minSideBar, setMinSideBar] = useState(false)
	const [closeSideBar, setCloseSideBar] = useState(false)

	const token = account && account.token
	useEffect(() => {
		if (token) {
			console.debug("creating socket")
			const s = new WebSocket(config.socketUrl)
			window.spSocket = s
			const socketOpenHandler = () => {
				console.debug("socket connected")
				message.success("聊天服务器连接成功！")
				setConnected(true)
				s.wasWorking = true
			}

			const socketCloseHandler = () => {
				s.disconnected = true

				if (s.wasWorking) {
					// Also get this callback if fail to open
					// only show error message connection break
					message.error("聊天服务器连接断开！")
				}
				setConnected(false)
				setSocket(null)

				console.debug(
					`socket closed unexpectedly, retry in ${
						config.socketReconnectWaitTime / 1000
					} sec...`
				)

				setTimeout(() => {
					setDisconnectCounter(disconnectCount => {
						return disconnectCount + 1
					})
				}, config.socketReconnectWaitTime)
				// }, disconnectCount * 10 * 1000)
			}

			s.addEventListener("open", socketOpenHandler)
			s.addEventListener("close", socketCloseHandler)
			setSocket(s)

			return () => {
				// unregister callbacks
				s.removeEventListener("open", socketOpenHandler)
				s.removeEventListener("close", socketCloseHandler)
				setConnected(false)
				setSocket(socket => {
					if (socket) {
						// if it's network disconnection, socket is already
						// disconnected and set to null
						// if it's account change caused cleanup, then this
						// code is executed
						socket.disconnected = true
						socket.close()
						return null
					}
				})
			}
		}
	}, [token, disconnectCount])

	useEffect(() => {
		// we have this separate useEffect which depends on
		// activeKey, events that don't depend on activeKey
		// should not be here
		const checkUnread = e => {
			const msg = JSON.parse(e.data)
			if (msg.name === "chat_message") {
				const roomId = msg.roomId

				if (roomId !== activeKey) {
					setPanes(panes => {
						return panes.map(p => {
							if (p.key === roomId) {
								return { ...p, unread: true }
							}
							return p
						})
					})
				}
			}
		}
		if (socket) {
			socket.addEventListener("message", checkUnread)
			return () => {
				socket.removeEventListener("message", checkUnread)
			}
		}
	}, [socket, activeKey])

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

		// unset unread flag
		setPanes(panes => {
			return panes.map(p => {
				if (p.key === activeKey) {
					return {
						...p,
						unread: false
					}
				}
				return p
			})
		})
	}

	const add = () => {
		const key = `newTab${newTabIndex++}`

		setPanes([...panes, { title: "选择房间", key: key }])
		setActiveKey(key)
		setMinSideBar(false)
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
	const updateRoom = (room, paneIndex) => {
		const newPanes = [...panes]
		newPanes[paneIndex] = {
			...newPanes[paneIndex],
			room: room,
			title: room.name
		}

		setPanes(newPanes)
	}
	const getAllRooms = useCallback(() => {
		return getRooms(url, domain)
	}, [url, domain])
	const setRoom = useCallback(
		(room, paneIndex) => {
			// fill in room id for site/page type of rooms
			if (room.type === "site") {
				room.id = domain
			} else if (room.type === "page") {
				room.id = url
			}

			// If room already open, set it to be active
			const existingPane = panes.filter(
				pane => pane.room && pane.room.id === room.id
			)
			if (existingPane.length) {
				setActiveKey(existingPane[0].key)
				return
			}

			// build a new pane to replace the old pane
			// pane key is also different
			const pane = {
				title: room.name,
				room: room,
				key: room.id
			}
			if (paneIndex === -1) {
				// user jump here from account/rooms tab
				// without creating a new tab first
				setPanes([...panes, pane])
			} else {
				panes[paneIndex] = pane
				setPanes([...panes])
			}
			setActiveKey(room.id)
		},
		[panes, url, domain]
	)
	useEffect(() => {
		const joinRoomEventHandler = e => {
			const room = e.detail
			setActiveTab("chat")
			setRoom(room, -1)
		}
		window.addEventListener("join_room", joinRoomEventHandler)
		return () => {
			window.removeEventListener("join_room", joinRoomEventHandler)
		}
	}, [setRoom, setActiveTab])
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
				onEdit={onEdit}
				tabPosition="left"
			>
				{panes.map((pane, paneIndex) => (
					<TabPane
						forceRender
						tab={
							<TabName
								minimized={minSideBar}
								title={pane.title}
								unread={pane.unread}
							/>
						}
						key={pane.key}
					>
						{!pane.room && (
							<NewTab
								account={account}
								close={() => {
									setCloseSideBar(false)
									remove(pane.key)
								}}
								joinRoom={room => {
									setRoom(room, paneIndex)
									setMinSideBar(true)
								}}
								getRooms={getAllRooms}
							/>
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
								connected={connected}
								socket={socket}
								account={account}
								room={pane.room}
								updateRoom={room => {
									updateRoom(room, paneIndex)
								}}
								exit={() => {
									// setMinSideBar(false)
									setCloseSideBar(false)
									remove(pane.key)
								}}
								active={activeKey === pane.key}
							/>
						)}
					</TabPane>
				))}
			</Tabs>
		</div>
	)
}

export default Chat
