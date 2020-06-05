import React, { useState } from "react"
import { Button, message } from "antd"
import { LeftOutlined, SaveOutlined } from "@ant-design/icons"

import Header from "components/Header"
import UserInfoForm from "components/UserInfoForm"
import { changePassword } from "./service"

function ChangePassword({ back }) {
	const [loading, setLoading] = useState(false)

	const onFinish = async values => {
		console.debug("Received values of form: ", values)
		setLoading(true)

		try {
			const resp = await changePassword(values)

			message.success("密码更新成功！")
		} catch (error) {
			message.error("密码更新失败！")
			console.error(error)
		}
		setLoading(false)
	}

	return (
		<>
			<Header
				leftItems={
					<>
						<Button icon={<LeftOutlined />} onClick={back} />
					</>
				}
				centerItems="更改密码"
			/>

			<UserInfoForm
				// user={account}
				fields={["password"]}
				submit={onFinish}
				submitBtn={
					<>
						<br />
						<Button
							type="primary"
							className="login-form-button"
							htmlType="submit"
							loading={loading}
							icon={<SaveOutlined />}
						>
							保存
						</Button>
					</>
				}
			/>
		</>
	)
}

export default ChangePassword
