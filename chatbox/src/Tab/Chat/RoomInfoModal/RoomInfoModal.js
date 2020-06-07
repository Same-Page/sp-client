import "./RoomInfoModal.css"
import React, { useState } from "react"

import { Modal, Form, message, Button } from "antd"
import { SaveOutlined } from "@ant-design/icons"

import AvatarWithPopover from "AvatarWithPopover"
import RoomInfoForm from "components/RoomInfoForm"
import { updateRoomInfo } from "Tab/Chat/service"

function RoomInfoModal({ room, updateRoom, isOwner, showModal, setShowModal }) {
	const [editRoom, setEditRoom] = useState(false)
	const [saving, setSaving] = useState(false)

	const [form] = Form.useForm()
	const submit = async values => {
		values.id = room.id
		setSaving(true)
		try {
			const resp = await updateRoomInfo(values)
			const room = resp.data
			setSaving(false)

			updateRoom(room)
			message.success("成功！")
			setTimeout(() => {
				setEditRoom(false)
				setShowModal(false)
			}, 2000)
		} catch (error) {
			message.error("失败！")
			console.error(error)
			setSaving(false)
		}
	}
	return (
		<Modal
			centered
			title="房间信息"
			visible={showModal}
			onCancel={() => {
				setEditRoom(false)
				setShowModal(false)
			}}
			footer={editRoom ? Modal.footer : null}
			onOk={form.submit}
			confirmLoading={saving}
			cancelText="取消"
			okText="保存"
			okButtonProps={{ icon: <SaveOutlined /> }}
		>
			{!editRoom && (
				<div>
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
					{room.addr && (
						<div className="sp-room-info-row">
							<h4>房间地址</h4>
							<div>{room.addr}</div>
						</div>
					)}
					{room.owner && (
						<div className="sp-room-info-row">
							<h4>房主</h4>

							<div>
								<AvatarWithPopover user={room.owner} popoverPlacement="right" />
								<span style={{ marginLeft: 10 }}>{room.owner.name}</span>
							</div>
						</div>
					)}

					{isOwner && (
						<Button
							style={{ padding: 0 }}
							type="link"
							onClick={() => {
								setEditRoom(true)
							}}
						>
							修改房间
						</Button>
					)}
				</div>
			)}
			{editRoom && <RoomInfoForm room={room} form={form} submit={submit} />}
		</Modal>
	)
}
export default RoomInfoModal
