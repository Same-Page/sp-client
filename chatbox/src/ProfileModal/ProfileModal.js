import "./ProfileModal.css"

import React from "react"
import { Modal } from "antd"

import UserInfo from "UserInfo"

function ProfileModal({ user, closeModal }) {
	return (
		<Modal
			title="用户信息"
			centered
			visible={true}
			onCancel={closeModal}
			footer={null}
			className="sp-modal sp-profile-modal"
		>
			<UserInfo user={user} visible={true} />
		</Modal>
	)
}

export default ProfileModal
