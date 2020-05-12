import "./Message.css"

import React from "react"
import MessageBody from "./Body"

import AvatarWithModal from "components/AvatarWithModal"

/*
This is used by chat messages and direct messages
props includes:
  user: object
  content
  type: text/sticker
  self

*/

function ChatMessage({
	content,
	user,
	messageUser,
	self,
	showMenu,
	timeDisplay,
	imageLoadedCb
}) {
	let userInfo = ""
	let messageTime = timeDisplay ? (
		<center
			style={{
				marginTop: 30,
				marginBottom: -10,
				color: "gray",
				fontSize: "smaller"
			}}
		>
			{timeDisplay}
		</center>
	) : (
		""
	)

	if (user) {
		const username = <span className="sp-message-username">{user.name}</span>

		const avatar = (
			<AvatarWithModal
				messageUser={messageUser}
				user={user}
				popoverPlacement={self ? "left" : "right"}
			/>
		)

		userInfo = (
			<div style={{ marginTop: 20 }}>
				{self ? (
					<>
						{/* {username} */}
						{avatar}
					</>
				) : (
					<>
						{avatar}
						{username}
					</>
				)}
			</div>
		)
	}
	return (
		<div
			className={self ? "self" : "other"}
			style={{ textAlign: self ? "right" : "left" }}
		>
			{messageTime}
			{userInfo}
			<MessageBody
				imageLoadedCb={imageLoadedCb}
				content={content}
				self={self}
				showMenu={showMenu}
			/>
		</div>
	)
}

export default ChatMessage
