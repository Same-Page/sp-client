import "./ProfileModal.css"

import React from "react"
import { Modal } from "antd"

import UserInfo from "UserInfo"

function ProfileModal({ user, setShowModal }) {
	return (
		<Modal
			title="用户信息"
			centered
			visible={true}
			onCancel={() => {
				setShowModal(false)
			}}
			footer={null}
			className="sp-modal sp-profile-modal"
		>
			<UserInfo user={user} />
		</Modal>
	)
}

export default ProfileModal
