import React from "react"
import "./Users.css"
import AvatarWithPopover from "components/AvatarWithPopover"

function Users({ users, messageUser }) {
	return (
		<div className="spp-room-users">
			{users.map(user => (
				<span key={user.id} className="sp-online-user">
					<AvatarWithPopover messageUser={messageUser} user={user} />
					<div className="sp-online-user-username">{user.name}</div>
				</span>
			))}
		</div>
	)
}

export default Users
