import React, { useState, useEffect } from "react"
import { UserOutlined } from "@ant-design/icons"
import { connect } from "react-redux"

import { Avatar } from "antd"

import ProfileModal from "ProfileModal"

function FollowRow({ user, activeTab }) {
	const [showModal, setShowModal] = useState(false)
	useEffect(() => {
		setShowModal(false)
	}, [activeTab])
	return (
		<>
			{showModal && <ProfileModal user={user} setShowModal={setShowModal} />}

			<div
				className="sp-follow-row"
				onClick={() => {
					setShowModal(true)
				}}
				key={user.id}
			>
				<Avatar shape="square" src={user.avatarSrc} icon={<UserOutlined />} />
				<span className="sp-username">{user.name}</span>
				{/* TODO: show follow time */}
			</div>
		</>
	)
}

const stateToProps = state => {
	return {
		activeTab: state.activeTab
	}
}
export default connect(stateToProps)(FollowRow)
