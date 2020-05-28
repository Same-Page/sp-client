import React, { useState } from "react"
import "./Login.css"

import { Form, Input, Button, message } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"

import Header from "components/Header"
import { login } from "./service"
import storageManager from "storage"
import LoadingAlert from "components/Alert/LoadingAlert"

const NormalLoginForm = ({ signup }) => {
	const [loading, setLoading] = useState(false)
	const onFinish = async values => {
		// console.debug("Received values of form: ", values)
		setLoading(true)
		try {
			const resp = await login(values.username, values.password)
			message.success("登录成功！")
			storageManager.set("account", resp.data)
		} catch (error) {
			message.error("登录失败！")
			console.error(error)
		}
		setLoading(false)
	}

	return (
		<div>
			<Header centerItems={<span>登录</span>} />
			{loading && <LoadingAlert text="登录中。。。" />}
			<Form
				name="normal_login"
				className="login-form"
				initialValues={{ remember: true }}
				onFinish={onFinish}
			>
				<Form.Item
					name="username"
					rules={[
						{
							required: true,
							message: "请输入电子邮箱地址"
						}
					]}
				>
					<Input
						prefix={<UserOutlined className="site-form-item-icon" />}
						placeholder="电子邮箱"
					/>
				</Form.Item>
				<Form.Item
					name="password"
					rules={[
						{
							required: true,
							message: "请输入密码"
						}
					]}
				>
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="password"
						placeholder="密码"
					/>
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						className="login-form-button"
						disabled={loading}
					>
						登录
					</Button>
					或 {/* eslint-disable-next-line */}
					<a href="#" onClick={signup}>
						注册!
					</a>
				</Form.Item>
			</Form>
		</div>
	)
}

export default NormalLoginForm
