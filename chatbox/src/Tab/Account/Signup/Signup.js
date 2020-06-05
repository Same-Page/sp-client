import React, { useState } from "react"
import { Button, message } from "antd"
import { SmileOutlined } from "@ant-design/icons"

import Header from "components/Header"
import UserInfoForm from "components/UserInfoForm"
import { signup } from "./service"
import storageManager from "storage"
import LoadingAlert from "components/Alert/LoadingAlert"
import { checkEmailNotRegistered } from "../emailValidation"

const Signup = ({ login }) => {
	const [loading, setLoading] = useState(false)

	const onFinish = async values => {
		console.debug("Received values of form: ", values)
		setLoading(true)

		try {
			const resp = await signup(values)

			message.success("注册成功！")
			storageManager.set("account", resp.data)
		} catch (error) {
			message.error("注册失败！")
			console.error(error)
		}
		setLoading(false)
	}

	return (
		<div className="sp-flex-body">
			<Header centerItems={<span>注册</span>} />
			{loading && <LoadingAlert text="注册中。。。" />}

			<div style={{ flexGrow: 1, overflowY: "auto", paddingBottom: 30 }}>
				<UserInfoForm
					validateEmail={checkEmailNotRegistered}
					fields={["email", "name", "password", "about", "website"]}
					submit={onFinish}
					submitBtn={
						<>
							<Button
								type="primary"
								className="login-form-button"
								htmlType="submit"
								loading={loading}
								icon={<SmileOutlined />}
							>
								注册
							</Button>
							或 {/* eslint-disable-next-line */}
							<a href="#" onClick={login}>
								登录!
							</a>
						</>
					}
				/>
			</div>
		</div>
	)
}

export default Signup
