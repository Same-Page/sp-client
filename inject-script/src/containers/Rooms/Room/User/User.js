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
				clearTimeout(timeout)
			}
		}
	}, [user.message])
	return (
		<span>
			{message && <div className="sp-chat-bubble">{message}</div>}

			<span
				title={user.name}
				style={{ backgroundImage: `url('${user.avatarSrc}')` }}
				className="sp-avatar"
			/>
		</span>
	)
}

export default User
