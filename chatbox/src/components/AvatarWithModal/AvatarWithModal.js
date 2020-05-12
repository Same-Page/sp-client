import "./AvatarWithModal.css"

import React, { useState } from "react"
import { Avatar } from "antd"

import ProfileModal from "components/ProfileModal"

function AvatarWithModal({ user, messageUser }) {
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
			{showModal && (
				<ProfileModal
					user={user}
					messageUser={messageUser}
					setShowModal={setShowModal}
				/>
			)}
		</>
	)
}

export default AvatarWithModal
