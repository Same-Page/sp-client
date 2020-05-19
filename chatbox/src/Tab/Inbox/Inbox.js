import "./Inbox.css"

import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { message } from "antd"

import { getConversations } from "./service"
import { messageUser, setInboxUser } from "redux/actions"
import ConversationTab from "./ConversationTab"
import OverviewTab from "./OverviewTab"

function Inbox({ account, user, setInboxUser, messageUser }) {
	// user and setInbox user are used for determining which conversation to render
	// selectedConversation is only updated as a side effect when user is updated
	const [conversations, setConversations] = useState([])
	const [selectedCon, setSelectedCon] = useState()
	const [loading, setLoading] = useState(false)

	const fetchData = async () => {
		setLoading(true)
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
		setLoading(false)
	}

	useEffect(() => {
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
		<>
			{!selectedCon && (
				<OverviewTab
					conversations={conversations}
					setInboxUser={setInboxUser}
					loading={loading}
					fetchData={fetchData}
				/>
			)}

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
		</>
	)
}

const stateToProps = state => {
	return {
		user: state.inboxUser
	}
}
export default connect(stateToProps, { messageUser, setInboxUser })(Inbox)
