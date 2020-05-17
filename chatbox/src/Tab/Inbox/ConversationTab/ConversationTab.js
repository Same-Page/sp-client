import React, { useState } from "react"
import { Button } from "antd"
import { LeftOutlined } from "@ant-design/icons"

import Conversation from "components/Conversation"
import InputWithPicker from "components/InputWithPicker"
import ProfileModal from "components/ProfileModal"
import Header from "components/Header"

import { postMessage } from "../service"

function ConversationTab({
	account,
	user,
	messages,
	setConversations,
	messageUser,
	back
}) {
	const [showProfileModal, setShowProfileModal] = useState(false)
	const [sending, setSending] = useState(false)
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
	return (
		<div className="sp-flex-body sp-conversation-tab">
			{showProfileModal && (
				<ProfileModal
					user={user}
					messageUser={messageUser}
					setShowModal={setShowProfileModal}
				/>
			)}

			<Header
				leftItems={
					<>
						<Button icon={<LeftOutlined />} onClick={back} />
					</>
				}
				centerItems={
					<Button
						onClick={() => {
							setShowProfileModal(true)
						}}
					>
						{user.name}
					</Button>
				}
			/>

			<Conversation
				backgroundColor="rgb(246, 249, 252)"
				messages={messagesWithUserData(user, messages)}
				messageUser={messageUser}
			/>
			<InputWithPicker
				autoFocus={true}
				sending={sending}
				send={input => {
					setSending(true)
					postMessage(user.id, input, -1)
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
	)
}

export default ConversationTab
