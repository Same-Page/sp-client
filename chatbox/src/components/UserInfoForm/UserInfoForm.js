import "./UserInfoForm.css"
import React, { useState } from "react"
import { Form, Input, Upload, message } from "antd"

const formItemLayout = {
	labelCol: {
		xs: {
			span: 24
		},
		sm: {
			// span: 8
			span: 24 // always separate lines
		}
	},
	wrapperCol: {
		xs: {
			span: 24
		},
		sm: {
			// span: 16
			span: 24
		}
	}
}
const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0
		},
		// sm: {
		// 	span: 16,
		// 	offset: 8
		// },
		sm: {
			span: 24, //always full width
			offset: 0
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

const UserInfoForm = ({ submit, submitBtn, fields, user, validateEmail }) => {
	const [form] = Form.useForm()
	const [avatarUrl, setAvatarUrl] = useState(null)
	const [avatarFile, setAvatarFile] = useState(null)
	const originalAvatarUrl = user && user.avatarSrc

	const avatarImgHandleChange = info => {
		if (info.file.status === "uploading") {
			// if beforeUpload return true, then status become uploading
			// and file.originaFileObj is set
			setAvatarFile(info.file.originFileObj)
			getBase64(info.file.originFileObj, imageUrl => setAvatarUrl(imageUrl))
		}
	}
	return (
		<Form
			className="sp-user-info-form sp-form"
			{...formItemLayout}
			labelAlign="left"
			form={form}
			name="sp-user-info"
			onFinish={values => {
				values.avatar = avatarFile
				submit(values)
			}}
			initialValues={{
				name: user && user.name,
				email: user && user.email,
				about: user && user.about,
				website: user && user.website
			}}
			scrollToFirstError
		>
			{fields.includes("avatar") && (
				<>
					<div style={{ marginBottom: 10 }}>头像</div>
					<Upload
						name="avatar"
						listType="picture-card"
						showUploadList={false}
						accept="image/*"
						customRequest={() => {}}
						beforeUpload={beforeUpload}
						onChange={avatarImgHandleChange}
					>
						{avatarUrl || originalAvatarUrl ? (
							<img
								src={avatarUrl || originalAvatarUrl}
								alt="头像"
								style={{ width: "100%" }}
							/>
						) : (
							<span>点击上传</span>
						)}
					</Upload>
				</>
			)}
			{fields.includes("email") && (
				<Form.Item
					name="email"
					label="电子邮箱"
					hasFeedback
					rules={[
						{
							type: "email",
							message: "电子邮箱格式不对!"
						},
						{
							required: true,
							message: "请输入电子邮箱地址!"
						},
						({ getFieldValue }) => ({
							validator(rule, value) {
								return validateEmail(value)
							}
						})
					]}
				>
					<Input />
				</Form.Item>
			)}

			{fields.includes("password") && (
				<Form.Item
					name="password"
					label="密码"
					rules={[
						{
							required: true,
							message: "请输入密码!"
						}
					]}
					hasFeedback
				>
					<Input.Password />
				</Form.Item>
			)}

			{fields.includes("password") && (
				<Form.Item
					name="confirm"
					label="确认密码"
					dependencies={["password"]}
					hasFeedback
					rules={[
						{
							required: true,
							message: "请再次输入密码!"
						},
						({ getFieldValue }) => ({
							validator(rule, value) {
								if (!value || getFieldValue("password") === value) {
									return Promise.resolve()
								}

								return Promise.reject("两次输入的密码不同!")
							}
						})
					]}
				>
					<Input.Password />
				</Form.Item>
			)}

			{fields.includes("name") && (
				<Form.Item
					name="name"
					label={<span>昵称</span>}
					rules={[
						{
							required: true,
							message: "请输入你的昵称!",
							whitespace: true
						}
					]}
				>
					<Input />
				</Form.Item>
			)}
			{fields.includes("about") && (
				<Form.Item
					name="about"
					label={<span>个人简介</span>}
					rules={[
						{
							required: false,
							whitespace: true
						}
					]}
				>
					<Input />
				</Form.Item>
			)}
			{fields.includes("website") && (
				<Form.Item
					name="website"
					label="网站"
					rules={[
						{
							required: false,
							message: "请输入你的网站地址!"
						}
					]}
				>
					<Input placeholder="你的个人网站或者常去的网站" />
				</Form.Item>
			)}

			<Form.Item {...tailFormItemLayout}>{submitBtn}</Form.Item>
		</Form>
	)
}

export default UserInfoForm
