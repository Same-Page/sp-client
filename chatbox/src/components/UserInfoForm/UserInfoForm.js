import "./UserInfoForm.css"
import React, { useState } from "react"
import { Form, Input, AutoComplete } from "antd"

import AvatarUploader from "components/AvatarUploader"

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
let avatarFile = null

const UserInfoForm = ({ submit, submitBtn, fields, user }) => {
	const [form] = Form.useForm()

	const [autoCompleteResult, setAutoCompleteResult] = useState([])

	const onWebsiteChange = value => {
		if (!value) {
			setAutoCompleteResult([])
		} else {
			setAutoCompleteResult(
				[".com", ".org", ".net", ".me"].map(domain => `${value}${domain}`)
			)
		}
	}

	const websiteOptions = autoCompleteResult.map(website => ({
		label: website,
		value: website
	}))
	return (
		<Form
			className="sp-user-info-form"
			{...formItemLayout}
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
			{fields.includes("email") && (
				<Form.Item
					name="email"
					label="电子邮箱"
					rules={[
						{
							type: "email",
							message: "电子邮箱格式不对!"
						},
						{
							required: true,
							message: "请输入电子邮箱地址!"
						}
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
			{fields.includes("avatar") && (
				<Form.Item>
					<AvatarUploader
						setFile={file => {
							avatarFile = file
						}}
					/>
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
					<AutoComplete
						options={websiteOptions}
						onChange={onWebsiteChange}
						placeholder="你的个人网站或者常去的网站"
					>
						<Input />
					</AutoComplete>
				</Form.Item>
			)}

			<Form.Item {...tailFormItemLayout}>{submitBtn}</Form.Item>
		</Form>
	)
}

export default UserInfoForm
