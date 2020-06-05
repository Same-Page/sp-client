import React, { useState } from "react"
import { Button, message } from "antd"
import { LeftOutlined, SaveOutlined } from "@ant-design/icons"

import Header from "components/Header"
import UserInfoForm from "components/UserInfoForm"
import { updateInfo } from "./service"
import storageManager from "storage"
import LoadingAlert from "components/Alert/LoadingAlert"
import FloatingAlert from "components/Alert/FloatingAlert"
import { checkEmailNotRegistered } from "Tab/Account/emailValidation"

const UpdateInfo = ({ account, back }) => {
	const [loading, setLoading] = useState(false)
	const [updated, setUpdated] = useState(false)

	const onFinish = async values => {
		console.debug("Received values of form: ", values)
		setLoading(true)

		try {
			const resp = await updateInfo(values)

			message.success("保存成功！")
			setUpdated(true)
			storageManager.set("account", resp.data)
		} catch (error) {
			message.error("保存失败！")
			console.error(error)
			setUpdated(false)
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
				centerItems={<span>编辑资料</span>}
			/>
			{loading && <LoadingAlert text="保存中。。。" />}
			{!loading && updated && <FloatingAlert text="已保存" type="success" />}
			<div style={{ flexGrow: 1, overflowY: "auto", paddingBottom: 30 }}>
				<UserInfoForm
					user={account}
					validateEmail={email => {
						if (email !== account.email) {
							// check email not used if changing email
							return checkEmailNotRegistered(email)
						}
						return Promise.resolve()
					}}
					fields={["name", "email", "about", "avatar", "website"]}
					submit={onFinish}
					submitBtn={
						<>
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
			</div>
		</>
	)
}

export default UpdateInfo
