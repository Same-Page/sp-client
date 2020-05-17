import "./Inbox.css"

import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import moment from "moment"
import { Avatar, message } from "antd"

import { getConversations } from "./service"
import { messageUser, setInboxUser } from "redux/actions"
import ConversationTab from "./ConversationTab"

function lastMsg(conversation) {
	const messages = conversation.messages
	if (messages.length > 0) {
		return messages[messages.length - 1]
	}
	return null
}

function Inbox({ account, user, setInboxUser, messageUser }) {
	// user and setInbox user are used for determining which conversation to render
	// selectedConversation is only updated as a side effect when user is updated
	const [conversations, setConversations] = useState([])
	const [selectedCon, setSelectedCon] = useState()
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
			const existingCon = conversations.find(c => {
				return c.user.id.toString() === user.id.toString()
			})
			if (existingCon) {
				setSelectedCon(existingCon)
			} else {
				setConversations([
					{
						user: user,
						messages: []
					},
					...conversations
				])
			}
		} else {
			setSelectedCon(null)
		}
	}, [user, conversations])

	if (!account) {
		return <>请登录</>
	}
	return (
		<div className="sp-inbox-tab">
			{!selectedCon &&
				conversations.map(c => (
					<div
						className="sp-inbox-item"
						onClick={() => {
							setInboxUser(c.user)
						}}
						key={c.user.id.toString()}
					>
						<Avatar shape="square" size={50} src={c.user.avatarSrc} />
						<span className="sp-inbox-item-right">
							<div className="sp-username-msgtime-row">
								<span className="sp-username">{c.user.name}</span>
								{lastMsg(c) && (
									<span className="sp-lastmsg-time">
										{moment(lastMsg(c).created_at).fromNow()}
									</span>
								)}
							</div>
							<div className="sp-lastmsg-content">
								{(lastMsg(c) && lastMsg(c).content.value) || "..."}
							</div>
						</span>
						<div style={{ clear: "both" }}></div>
					</div>
				))}
			{selectedCon && (
				<ConversationTab
					account={account}
					user={selectedCon.user}
					messages={selectedCon.messages}
					setConversations={setConversations}
					messageUser={messageUser}
					back={() => {
						setInboxUser(null)
					}}
				/>
			)}
		</div>
	)
}

const stateToProps = state => {
	return {
		user: state.inboxUser
	}
}
export default connect(stateToProps, { messageUser, setInboxUser })(Inbox)
