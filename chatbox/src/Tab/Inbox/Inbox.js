import "./Inbox.css"

import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { message } from "antd"

import { getConversations } from "./service"
import { messageUser, setInboxUser } from "redux/actions"
import ConversationTab from "./ConversationTab"
import OverviewTab from "./OverviewTab"
import Alert from "components/Alert"
import storageManager from "storage"

function getStorageKey(accountId) {
	return "inbox-" + accountId
}
function getLastMsgId(consDict) {
	let res = -1
	Object.keys(consDict).forEach(userId => {
		const con = consDict[userId]
		const lastMsg = con.messages[con.messages.length - 1]
		res = Math.max(res, lastMsg.id)
	})
	return res
}

function Inbox({ account, user, setInboxUser, messageUser, storageData }) {
	// user and setInbox user are used for determining which conversation to render
	// selectedConversation is only updated as a side effect when user is updated

	// consDict is original format from server, stored in localStorage
	// conversations is an array that's used to render in UI
	const [consDict, setConsDict] = useState({})
	const [conversations, setConversations] = useState([])
	const [selectedCon, setSelectedCon] = useState()
	const [loading, setLoading] = useState(false)
	const [lastMsgId, setLastMsgId] = useState(-1)

	const accountId = account && account.id

	const mergeNewConversations = newConsDict => {
		// newConsDict = {
		// 	<userId>: {
		// 		user: {},
		//      messages: []
		// 	},
		//  ...
		// }

		for (let [userId, newCon] of Object.entries(newConsDict)) {
			if (userId in consDict) {
				const con = consDict[userId]
				// use latest user data
				con.user = newCon.user
				console.log(con.messages)
				console.log(newCon.messages)

				con.messages.push(...newCon.messages)
				console.log(con.messages)
			} else {
				consDict[userId] = newCon
			}
		}
		setConsDict({ ...consDict })
		storageManager.set("inbox-" + account.id, consDict)
	}

	const fetchData = async offset => {
		offset = offset || -1
		offset = Math.max(offset, lastMsgId)

		setLoading(true)
		try {
			console.debug("get inbox messages")
			const resp = await getConversations(offset)
			const newConsDict = resp.data
			if (Object.keys(newConsDict).length > 0) {
				message.success("收到新消息")
				mergeNewConversations(newConsDict)
			}
		} catch (error) {
			message.error("无法读取新消息！")
			console.error(error)
		}
		setLoading(false)
	}

	useEffect(() => {
		const lastMsgId = getLastMsgId(consDict)
		console.debug("lastMsgId", lastMsgId)
		setLastMsgId(lastMsgId)

		// convert dict to array
		let cons = Object.keys(consDict).map(userId => consDict[userId])
		cons = cons.sort(
			(b, a) =>
				a.messages[a.messages.length - 1].id -
				b.messages[b.messages.length - 1].id
		)
		console.debug(cons)
		setConversations(cons)
	}, [consDict])

	useEffect(() => {
		if (accountId) {
			const conversationsInStorage = storageData[getStorageKey(accountId)] || []
			mergeNewConversations(conversationsInStorage)
			fetchData(getLastMsgId(conversationsInStorage))
		} else {
			setConsDict({})
		}
	}, [accountId, storageData])

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
		return <Alert text="请先登录" border="bottom" />
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
					mergeNewConversations={mergeNewConversations}
					messageUser={messageUser}
					lastMsgId={lastMsgId}
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
