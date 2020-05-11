import "./AvatarWithModal.css"

import React, { useState } from "react"
import { Avatar, Modal } from "antd"

import Profile from "components/Profile"

function AvatarWithModal({ user }) {
	const [showModal, setShowModal] = useState(false)
	return (
		<>
			<Avatar
				onClick={() => {
					setShowModal(true)
				}}
				style={{ cursor: "pointer" }}
				size="large"
				src={user.avatarSrc}
			/>
			<Modal
				title="用户信息"
				visible={showModal}
				onCancel={() => {
					setShowModal(false)
				}}
				footer={null}
				className="sp-profile-modal"
			>
				<Profile user={user} />
			</Modal>
		</>
	)
}

export default AvatarWithModal
