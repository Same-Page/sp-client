import React, { useState } from "react"
import { Button, Avatar } from "antd"
import { MenuOutlined } from "@ant-design/icons"

import Conversation from "components/Conversation"
import InputWithPicker from "components/InputWithPicker"
import ProfileModal from "components/ProfileModal"

import { postMessage } from "../service"

function ConversationTab({
	account,
	user,
	messages,
	setConversations,
	messageUser,
	setMinSideBar,
	closeSideBar,
	setCloseSideBar
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
		<>
			{showProfileModal && (
				<ProfileModal
					user={user}
					messageUser={messageUser}
					setShowModal={setShowProfileModal}
				/>
			)}
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

				<Button
					onClick={() => {
						setShowProfileModal(true)
					}}
				>
					<Avatar src={user.avatarSrc} size={25} style={{ marginRight: 5 }} />
					<span>{user.name}</span>
				</Button>
			</div>

			<Conversation messages={messagesWithUserData(user, messages)} />
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
		</>
	)
}

export default ConversationTab
