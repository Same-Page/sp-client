import React from "react"
import "./Users.css"
import AvatarWithPopover from "AvatarWithPopover"

function Users({ users }) {
	return (
		<div className="spp-room-users">
			{users.map(user => (
				<span key={user.id} className="sp-online-user">
					<AvatarWithPopover user={user} />
					<div className="sp-online-user-username">{user.name}</div>
				</span>
			))}
		</div>
	)
}

export default Users
