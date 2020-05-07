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
				<p>房间名</p>
				<h4>{room.name}</h4>
			</div>
			{room.about && (
				<div className="sp-room-info-row">
					<p>房间介绍</p>
					<h4>{room.about}</h4>
				</div>
			)}
			{room.owner && (
				<div className="sp-room-info-row">
					<p>房主</p>
					<h4>
						<div>
							<AvatarWithModal user={room.owner} />
							<span style={{ marginLeft: 10 }}>{room.owner.name}</span>
						</div>
					</h4>
				</div>
			)}
		</Modal>
	)
}
export default RoomInfoModal
