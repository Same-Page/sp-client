import "./AvatarWithModal.css"

import React, { useState } from "react"
import { Avatar } from "antd"

import ProfileModal from "components/ProfileModal"

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
			{showModal && <ProfileModal user={user} setShowModal={setShowModal} />}
		</>
	)
}

export default AvatarWithModal
