import React, { useState } from "react"
import { Form, Modal, message } from "antd"
import { SaveOutlined } from "@ant-design/icons"

import RoomInfoForm from "components/RoomInfoForm"
import { createRoom } from "Tab/Chat/service"
import storageManager from "storage"

const CreateRoom = ({
	account,
	joinRoom,
	showCreateRoomModal,
	setShowCreateRoomModal
}) => {
	const [saving, setSaving] = useState(false)

	const [form] = Form.useForm()
	const submit = async values => {
		setSaving(true)
		try {
			const resp = await createRoom(values)
			const room = resp.data
			setSaving(false)

			joinRoom(room)
			message.success("成功！")
			storageManager.set("account", {
				...account,
				roomCount: account.roomCount + 1
			})
		} catch (error) {
			message.error("失败！")
			console.error(error)
			setSaving(false)
		}
	}
	return (
		<Modal
			title="创建新房间"
			centered
			visible={showCreateRoomModal}
			onCancel={() => {
				setShowCreateRoomModal(false)
			}}
			onOk={form.submit}
			confirmLoading={saving}
			cancelText="取消"
			okText="保存"
			okButtonProps={{ icon: <SaveOutlined /> }}
		>
			<RoomInfoForm form={form} submit={submit} />
		</Modal>
	)
}

export default CreateRoom
