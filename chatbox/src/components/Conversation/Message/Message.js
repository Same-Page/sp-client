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
		if (self) {
			userInfo = (
				<div style={{ marginTop: 20 }}>
					<span className="sp-message-username">{user.name}</span>
					<AvatarWithModal user={user} />
				</div>
			)
		} else {
			userInfo = (
				<div style={{ marginTop: 20 }}>
					<AvatarWithModal user={user} />
					<span className="sp-message-username">{user.name}</span>
				</div>
			)
		}
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
