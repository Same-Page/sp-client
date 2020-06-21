import "./RoomInfoModal.css"
import React, { useState } from "react"

import { Modal, Form, message, Button } from "antd"
import { SaveOutlined } from "@ant-design/icons"

import AvatarWithPopover from "AvatarWithPopover"
import RoomInfoForm from "components/RoomInfoForm"
import Blacklist from "./Blacklist"
import { updateRoomInfo } from "Tab/Chat/service"

function RoomInfoModal({
	room,
	updateRoom,
	isOwner,
	isMod,
	showModal,
	setShowModal
}) {
	const [view, setView] = useState("info") // info | edit | blacklist
	const [saving, setSaving] = useState(false)

	const [form] = Form.useForm()
	const submitRoomInfo = async values => {
		values.id = room.id
		setSaving(true)
		try {
			const resp = await updateRoomInfo(values)
			const room = resp.data
			setSaving(false)

			updateRoom(room)
			message.success("成功！")
			setTimeout(() => {
				setView("info")
				setShowModal(false)
			}, 2000)
		} catch (error) {
			message.error("失败！")
			console.error(error)
			setSaving(false)
		}
	}
	let title = "房间信息"
	if (view === "edit") {
		title = "修改房间信息"
	} else if (view === "blacklist") {
		title = "房间黑名单"
	}
	return (
		<Modal
			centered
			title={title}
			transitionName="none"
			visible={showModal}
			onCancel={() => {
				if (view === "info") {
					setShowModal(false)
				} else {
					setView("info")
				}
			}}
			footer={view === "edit" ? Modal.footer : null}
			onOk={form.submit}
			confirmLoading={saving}
			cancelText="取消"
			className="sp-modal"
			okText="保存"
			okButtonProps={{ icon: <SaveOutlined /> }}
		>
			{view === "info" && (
				<div>
					<div className="sp-room-info-row">
						<h4>ID</h4>
						<div>{room.id}</div>
					</div>

					<div className="sp-room-info-row">
						<h4>名称</h4>
						<div>{room.name}</div>
					</div>
					{room.about && (
						<div className="sp-room-info-row">
							<h4>介绍</h4>
							<div>{room.about}</div>
						</div>
					)}
					{/* {(room.type === "page" || room.type === "site") && (
						<div className="sp-room-info-row">
							<h4>房间地址</h4>
							<div>{room.id}</div>
						</div>
					)} */}

					{room.owner && (
						<div className="sp-room-info-row">
							<h4>房主</h4>

							<div>
								<AvatarWithPopover user={room.owner} popoverPlacement="right" />
								<span style={{ marginLeft: 10 }}>{room.owner.name}</span>
							</div>
						</div>
					)}

					{isMod && (
						<>
							<Button
								style={{ padding: 0 }}
								type="link"
								onClick={() => {
									setView("edit")
								}}
							>
								修改房间
							</Button>
							<Button
								style={{ padding: 0, marginLeft: 20 }}
								type="link"
								onClick={() => {
									setView("blacklist")
								}}
							>
								黑名单
							</Button>
						</>
					)}
				</div>
			)}
			{view === "edit" && (
				<RoomInfoForm
					room={room}
					back={() => {
						setView("info")
					}}
					form={form}
					submit={submitRoomInfo}
				/>
			)}
			{view === "blacklist" && (
				<Blacklist
					room={room}
					back={() => {
						setView("info")
					}}
				/>
			)}
		</Modal>
	)
}
export default RoomInfoModal
