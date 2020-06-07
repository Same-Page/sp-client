import React, { useState } from "react"
import { Form, Input, Upload, message } from "antd"

const formItemLayout = {
	labelCol: {
		xs: {
			span: 24
		},
		sm: {
			span: 24 // always separate lines
		}
	},
	wrapperCol: {
		xs: {
			span: 24
		},
		sm: {
			span: 24
		}
	}
}

function getBase64(img, callback) {
	const reader = new FileReader()
	reader.addEventListener("load", () => callback(reader.result))
	reader.readAsDataURL(img)
}

function beforeUpload(file) {
	const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
	if (!isJpgOrPng) {
		message.error("只能上传图片!")
	}
	const isLt2M = file.size / 1024 / 1024 < 2
	if (!isLt2M) {
		message.error("图片必须小于 2MB")
	}
	// return false so it won't auto upload
	return isJpgOrPng && isLt2M
}

const RoomInfoForm = ({ room, form, submit }) => {
	const [coverImageUrl, setCoverImageUrl] = useState(null)
	const [coverImage, setCoverImage] = useState(null)
	const [backgroundImageUrl, setBackgroundImageUrl] = useState(null)
	const [backgroundImage, setBackgroundImage] = useState(null)
	const originalCover = room && room.cover
	const originalBg = room && room.background

	const coverImageHandleChange = info => {
		setCoverImage(info.file.originFileObj)
		getBase64(info.file.originFileObj, imageUrl => setCoverImageUrl(imageUrl))
	}
	const backgroundImageHandleChange = info => {
		setBackgroundImage(info.file.originFileObj)
		getBase64(info.file.originFileObj, imageUrl =>
			setBackgroundImageUrl(imageUrl)
		)
	}

	const submitForm = values => {
		values.cover = coverImage
		values.background = backgroundImage
		submit(values)
	}
	return (
		<Form
			// className="sp-form"
			{...formItemLayout}
			labelAlign="left"
			form={form}
			name="sp-create-room"
			onFinish={submitForm}
			initialValues={{
				name: room && room.name,
				about: room && room.about
			}}
			scrollToFirstError
		>
			<Form.Item
				name="name"
				label="名称"
				hasFeedback
				rules={[
					{
						required: true,
						message: "请填写房间名"
					}
				]}
			>
				<Input />
			</Form.Item>

			<Form.Item
				name="about"
				label="介绍"
				rules={[
					{
						required: true,
						message: "请填写房间介绍"
					}
				]}
				hasFeedback
			>
				<Input placeholder="介绍这个房间的话题与用户要遵守的规则" />
			</Form.Item>
			<div style={{ marginBottom: 10 }}>封面图片</div>
			<Upload
				name="cover"
				listType="picture-card"
				showUploadList={false}
				accept="image/*"
				customRequest={() => {}}
				beforeUpload={beforeUpload}
				onChange={coverImageHandleChange}
			>
				{coverImageUrl || originalCover ? (
					<img
						src={coverImageUrl || originalCover}
						alt="封面图片"
						style={{ width: "100%" }}
					/>
				) : (
					<span>点击上传</span>
				)}
			</Upload>
			<div style={{ marginBottom: 10 }}>背景图片</div>
			<Upload
				name="background"
				listType="picture-card"
				showUploadList={false}
				accept="image/*"
				customRequest={() => {}}
				beforeUpload={beforeUpload}
				onChange={backgroundImageHandleChange}
			>
				{backgroundImageUrl || originalBg ? (
					<img
						src={backgroundImageUrl || originalBg}
						alt="背景图片"
						style={{ width: "100%" }}
					/>
				) : (
					<span>点击上传</span>
				)}
			</Upload>
		</Form>
	)
}

export default RoomInfoForm
