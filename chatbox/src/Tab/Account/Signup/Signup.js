import "./Signup.css"
import React, { useState } from "react"
import { Form, Input, Button, AutoComplete, message } from "antd"

import Header from "components/Header"
import { signup } from "./service"
import storageManager from "storage"

const formItemLayout = {
	labelCol: {
		xs: {
			span: 24
		},
		sm: {
			span: 8
		}
	},
	wrapperCol: {
		xs: {
			span: 24
		},
		sm: {
			span: 16
		}
	}
}
const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0
		},
		sm: {
			span: 16,
			offset: 8
		}
	}
}

const RegistrationForm = ({ login }) => {
	const [form] = Form.useForm()

	const onFinish = async values => {
		console.log("Received values of form: ", values)
		try {
			const resp = await signup(
				values.email,
				values.name,
				values.password,
				values.website
			)

			message.success("注册成功！")
			storageManager.set("account", resp.data)
		} catch (error) {
			message.error("注册失败！")
			console.error(error)
		}
	}

	const [autoCompleteResult, setAutoCompleteResult] = useState([])

	const onWebsiteChange = value => {
		if (!value) {
			setAutoCompleteResult([])
		} else {
			setAutoCompleteResult(
				[".com", ".org", ".net"].map(domain => `${value}${domain}`)
			)
		}
	}

	const websiteOptions = autoCompleteResult.map(website => ({
		label: website,
		value: website
	}))
	return (
		<div>
			<Header centerItems={<span>注册</span>} />

			<Form
				className="sp-signup"
				{...formItemLayout}
				form={form}
				name="register"
				onFinish={onFinish}
				initialValues={{}}
				scrollToFirstError
			>
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
						placeholder="网站地址"
					>
						<Input />
					</AutoComplete>
				</Form.Item>

				<Form.Item {...tailFormItemLayout}>
					<Button
						type="primary"
						className="login-form-button"
						htmlType="submit"
					>
						注册
					</Button>
					或 {/* eslint-disable-next-line */}
					<a href="#" onClick={login}>
						登录!
					</a>
				</Form.Item>
			</Form>
		</div>
	)
}

export default RegistrationForm
