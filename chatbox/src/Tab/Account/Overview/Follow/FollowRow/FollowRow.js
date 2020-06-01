import React from "react"
import { UserOutlined } from "@ant-design/icons"

import { Avatar } from "antd"

function FollowRow({ user, setShowUserModal }) {
	return (
		<div
			className="sp-follow-row"
			onClick={() => {
				setShowUserModal(user)
			}}
			key={user.id}
		>
			<Avatar shape="square" src={user.avatarSrc} icon={<UserOutlined />} />
			<span className="sp-username">{user.name}</span>
			{/* TODO: show follow time */}
		</div>
	)
}

export default FollowRow
