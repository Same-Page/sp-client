import "./Message.css"

import React from "react"
import MessageBody from "./Body"

import AvatarWithPopover from "components/AvatarWithPopover"

function ChatMessage({
	content,
	user,
	messageUser,
	self,
	timeDisplay,
	imageLoadedCb,
	messageActions
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
			<AvatarWithPopover
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
				messageActions={messageActions}
			/>
		</div>
	)
}

export default ChatMessage
