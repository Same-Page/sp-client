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
			<UserInfo
				aboutWidth={300}
				rowWidth={250}
				user={user}
				visible={true}
				close={closeModal}
				partial={false}
			/>
		</Modal>
	)
}

export default ProfileModal
