import "./User.css"

import React, { useState, useEffect } from "react"

function User({ user }) {
	const [message, setMessage] = useState()

	useEffect(() => {
		if (user.message) {
			setMessage(user.message)
			const timeout = setTimeout(() => {
				setMessage(null)
			}, 3000)
			return () => {
				clearTimeout(timeout)
			}
		}
	}, [user.message])
	return (
		<>
			{message && <div className="sp-chat-bubble">{message}</div>}

			<span
				title={user.name}
				style={{ backgroundImage: `url('${user.avatarSrc}')` }}
				className="sp-avatar"
			/>
		</>
	)
}

export default User
