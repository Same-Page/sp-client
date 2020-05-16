// This file has been deprecated

// Inbox with sliding tabs doesn't look pretty with limited length

import "./Inbox.css"

import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Tabs, Button, message } from "antd"
import { LeftOutlined, CloseOutlined } from "@ant-design/icons"

import TabName from "components/TabName"

import { getConversations } from "./service"
import { messageUser, setInboxUser } from "redux/actions"
import ConversationTab from "./ConversationTab"

const { TabPane } = Tabs

function lastMsg(conversation) {
	const messages = conversation.messages
	if (messages.length > 0) {
		return messages[messages.length - 1]
	}
	return null
}

function Inbox({ account, user, setInboxUser, messageUser }) {
	const [minSideBar, setMinSideBar] = useState(false)
	const [closeSideBar, setCloseSideBar] = useState(false)
	const [conversations, setConversations] = useState([])

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

	useEffect(() => {
		// Pick selected conversation base on user
		if (user) {
			// if no previous conversation with user, create one
			const existingConversation = conversations.find(c => {
				return c.user.id.toString() === user.id.toString()
			})
			if (!existingConversation) {
				setConversations([
					{
						user: user,
						messages: []
					},
					...conversations
				])
			}
		} else {
			// If no conversation selected, select the first one
			if (conversations.length > 0) {
				setInboxUser(conversations[0].user)
			}
		}
	}, [user, conversations, setInboxUser])

	// useEffect(() => {
	// 	if (activeKey) {
	// 		setMinSideBar(true)
	// 	}
	// }, [activeKey])
	const onChange = key => {
		const c = conversations.find(c => {
			return c.user.id.toString() === key.toString()
		})
		setInboxUser(c.user)
	}

	const wrapperClassName =
		"sp-inbox-tab" +
		(minSideBar ? " sp-minimized" : "") +
		(closeSideBar ? " sp-closed" : "")

	if (!account) {
		return <>请登录</>
	}
	return (
		<div className={wrapperClassName}>
			<Tabs
				hideAdd
				onChange={onChange}
				activeKey={user && user.id.toString()}
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
								// floatRightExtra={
								// 	lastMsg(c) && moment(lastMsg(c).creaetd_at).fromNow()
								// }
							/>
						}
						key={c.user.id.toString()}
					>
						<div className="sp-room-tab">
							<ConversationTab
								account={account}
								user={c.user}
								messages={c.messages}
								setConversations={setConversations}
								messageUser={messageUser}
								setMinSideBar={setMinSideBar}
								closeSideBar={closeSideBar}
								setCloseSideBar={setCloseSideBar}
							/>
						</div>
					</TabPane>
				))}
			</Tabs>
		</div>
	)
}

const stateToProps = state => {
	return {
		user: state.inboxUser
	}
}
export default connect(stateToProps, { messageUser, setInboxUser })(Inbox)
