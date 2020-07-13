import "./User.css"

import React, { useState, useEffect } from "react"

function User({ user }) {
	const [message, setMessage] = useState()

	useEffect(() => {
		if (user.message) {
			setMessage(user.message)
			const timeout = setTimeout(() => {
				setMessage(null)
				user.message = null
			}, 3000)
			return () => {
				user.message = null
				setMessage(null)
				clearTimeout(timeout)
			}
		}
	}, [user.message])

	let body = <span>{message && message.value}</span>
	if (message && message.type === "image") {
		body = <img alt="" src={message.value} />
	}
	const bubbleClassName = "sp-user-chat-bubble " + (message && message.type)

	return (
		<span>
			{message && <div className={bubbleClassName}>{body}</div>}

			<span
				title={user.name}
				style={{ backgroundImage: `url('${user.avatarSrc}')` }}
				className="sp-avatar"
			/>
		</span>
	)
}

export default User
