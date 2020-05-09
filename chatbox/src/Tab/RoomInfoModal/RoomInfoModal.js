import "./RoomInfoModal.css"
import React from "react"

import { Modal } from "antd"
import AvatarWithModal from "Tab/AvatarWithModal"

function RoomInfoModal({ room, showModal, setShowModal }) {
	return (
		<Modal
			title="房间信息"
			visible={showModal}
			onCancel={() => {
				setShowModal(false)
			}}
			footer={null}
			className="sp-profile-modal"
		>
			<div className="sp-room-info-row">
				<h4>房间名</h4>
				<div>{room.name}</div>
			</div>
			{room.about && (
				<div className="sp-room-info-row">
					<h4>房间介绍</h4>
					<div>{room.about}</div>
				</div>
			)}
			{room.owner && (
				<div className="sp-room-info-row">
					<h4>房主</h4>

					<div>
						<AvatarWithModal user={room.owner} />
						<span style={{ marginLeft: 10 }}>{room.owner.name}</span>
					</div>
				</div>
			)}
		</Modal>
	)
}
export default RoomInfoModal
