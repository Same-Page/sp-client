import React, { useState, useEffect } from "react"
import "./Inbox.css"

import { Tabs, Button, Avatar, message } from "antd"
import { MenuOutlined, LeftOutlined, CloseOutlined } from "@ant-design/icons"
import moment from "moment"

import TabName from "components/TabName"
import Conversation from "components/Conversation"
import InputWithPicker from "components/InputWithPicker"
import ProfileModal from "components/ProfileModal"

import { getConversations, postMessage } from "./service"

const { TabPane } = Tabs

const initPanes = [
	{ title: "用户 1", key: "1" },
	{ title: "用户 2", key: "2" }
]

function lastMsg(conversation) {
	const messages = conversation.messages
	if (messages.length > 0) {
		return messages[messages.length - 1]
	}
	return null
}

function Inbox({ account }) {
	const [panes, setPanes] = useState(initPanes)
	const [activeKey, setActiveKey] = useState(initPanes[0].key)
	const [minSideBar, setMinSideBar] = useState(false)
	const [closeSideBar, setCloseSideBar] = useState(false)
	const [sending, setSending] = useState(false)
	const [conversations, setConversations] = useState([])
	const [showProfileModal, setShowProfileModal] = useState(false)

	useEffect(() => {
		async function fetchData() {
			try {
				console.debug("get inbox messages")
				const resp = await getConversations()
				const newConversations = resp.data
				setConversations(newConversations)
				if (newConversations.length > 0) {
					message.success("收到新消息")
				}
				// storageManager.set("account", resp.data)
			} catch (error) {
				message.error("无法读取新消息！")
				console.error(error)
			}
		}
		if (account) {
			fetchData()
		}
	}, [account])

	const messagesWithUserData = (otherUser, messages) => {
		// fill in user data for each message so it's consistent with
		// message format of chat message
		const res = messages.map(m => {
			// do not modify original message data
			const massagedM = { ...m }
			if (massagedM.self) {
				massagedM.user = account
			} else {
				massagedM.user = otherUser
			}
			return massagedM
		})
		return res
	}

	const onChange = activeKey => {
		setActiveKey(activeKey)
		setMinSideBar(true)
	}

	// const add = conversation => {
	// 	panes.push(conversation)
	// 	setPanes(panes)
	// 	setActiveKey(conversation.user.id)
	// }

	// const remove = targetKey => {
	// 	let lastIndex
	// 	panes.forEach((pane, i) => {
	// 		if (pane.key === targetKey) {
	// 			lastIndex = i - 1
	// 		}
	// 	})
	// 	const newPanes = panes.filter(pane => pane.key !== targetKey)
	// 	if (newPanes.length && activeKey === targetKey) {
	// 		// Update activeKey if removed the active pane
	// 		// Use the pane before or after if no before ones
	// 		let newActiveKey = -1
	// 		if (lastIndex >= 0) {
	// 			newActiveKey = newPanes[lastIndex].key
	// 		} else {
	// 			newActiveKey = newPanes[0].key
	// 		}
	// 		setActiveKey(newActiveKey)
	// 	}
	// 	setPanes(newPanes)
	// }
	// const onEdit = (targetKey, action) => {
	// 	if (action === "add") {
	// 		add(targetKey)
	// 	} else if (action === "remove") {
	// 		remove(targetKey)
	// 	} else {
	// 		console.error(action)
	// 	}
	// }
	const wrapperClassName =
		"sp-inbox-tabs" +
		(minSideBar ? " sp-minimized" : "") +
		(closeSideBar ? " sp-closed" : "")

	if (!account) {
		return <>请登录</>
	}
	return (
		<div className={wrapperClassName}>
			{/* <div className="sp-tab-header">
				
			</div> */}

			<Tabs
				hideAdd
				onChange={onChange}
				activeKey={activeKey}
				// type="editable-card" commented out otherwise style is a mess
				// onEdit={onEdit}
				tabPosition="left"
				tabBarExtraContent={
					<span>
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
			>
				{conversations.map(c => (
					<TabPane
						tab={
							<TabName
								minimized={minSideBar}
								iconUrl={c.user.avatarSrc}
								size="large"
								title={c.user.name}
								description={lastMsg(c) && lastMsg(c).content.value}
								floatRightExtra={
									lastMsg(c) && moment(lastMsg(c).creaetd_at).fromNow()
								}
							/>
						}
						key={c.user.id}
					>
						<div className="sp-room-tab">
							<div className="sp-room-top-bar">
								{closeSideBar && (
									<Button
										onClick={() => {
											setCloseSideBar(false)
											setMinSideBar(false)
										}}
									>
										<MenuOutlined />
										<span>列表</span>
									</Button>
								)}
								{showProfileModal && (
									<ProfileModal
										user={c.user}
										setShowModal={setShowProfileModal}
									/>
								)}
								<Button
									onClick={() => {
										setShowProfileModal(true)
									}}
								>
									<Avatar
										src={c.user.avatarSrc}
										size={25}
										style={{ marginRight: 5 }}
									/>
									<span>{c.user.name}</span>
								</Button>
							</div>

							<Conversation
								messages={messagesWithUserData(c.user, c.messages)}
							/>
							<InputWithPicker
								autoFocus={true}
								sending={sending}
								send={input => {
									setSending(true)
									postMessage(c.user.id, input, -1)
										.then(resp => {
											setConversations(resp.data)

											// TODO: let socket server help ping user right away
											// socketManager.sendEvent("private message", { userId: other.id })
										})
										.catch(err => {
											console.error(err)
										})
										.then(() => {
											setSending(false)
										})
									return true
								}}
							/>
						</div>
					</TabPane>
				))}
			</Tabs>
		</div>
	)
}
export default Inbox
