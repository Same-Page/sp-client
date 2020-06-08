import React, { useState } from "react"
import "./Login.css"

import { Form, Input, Button, message } from "antd"
import { LockOutlined, LoginOutlined, MailOutlined } from "@ant-design/icons"

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
			const resp = await login(values)
			message.success("登录成功！")
			setLoading(false)

			storageManager.set("account", resp.data)
		} catch (error) {
			message.error("登录失败！")
			console.error(error)
			setLoading(false)
		}
		// setLoading(false) is commented out because component is
		// already unmounted?
		// setLoading(false)
	}

	return (
		<div>
			<Header centerItems={<span>登录</span>} />
			<div style={{ flexGrow: 1, overflowY: "auto", paddingBottom: 30 }}>
				{/* {loading && <LoadingAlert text="登录中。。。" />} */}

				<Form
					name="normal_login"
					className="login-form"
					initialValues={{ remember: true }}
					onFinish={onFinish}
				>
					<Form.Item
						name="email"
						rules={[
							{
								required: true,
								message: "请输入电子邮箱地址"
							}
						]}
					>
						<Input
							prefix={<MailOutlined className="site-form-item-icon" />}
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
							loading={loading}
							icon={<LoginOutlined />}
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
		</div>
	)
}

export default NormalLoginForm
