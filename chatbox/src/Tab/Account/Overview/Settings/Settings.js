import React, { useEffect, useState } from "react"
import { Button, Switch } from "antd"
import { LeftOutlined } from "@ant-design/icons"

import Header from "components/Header"
import storageManager from "storage"

// import { changePassword } from "./service"

function Settings({ back, storageData }) {
	// const [loading, setLoading] = useState(false)
	const [showAvatar, setShowAvatar] = useState(false)
	const [showDanmu, setShowDanmu] = useState(false)

	// const onFinish = async values => {
	// 	console.debug("Received values of form: ", values)
	// 	setLoading(true)

	// try {
	// 	const resp = await changePassword(values)

	// 	message.success("密码更新成功！")
	// } catch (error) {
	// 	message.error("密码更新失败！")
	// 	console.error(error)
	// }
	// setLoading(false)
	// }
	useEffect(() => {
		if (storageData) {
			if (storageData.showAvatar != null) {
				setShowAvatar(storageData.showAvatar)
			}
			if (storageData.showDanmu != null) {
				setShowDanmu(storageData.showDanmu)
			}
		}
	}, [storageData])

	return (
		<>
			<Header
				leftItems={
					<>
						<Button icon={<LeftOutlined />} onClick={back} />
					</>
				}
				centerItems="设置"
			/>

			<div style={{ padding: 30, overflow: "auto" }}>
				<div>
					网页底部显示用户{" "}
					<Switch
						checked={showAvatar}
						onChange={val => {
							storageManager.set("showAvatar", val)
							setShowAvatar(val)
						}}
					/>
				</div>
				<div style={{ marginTop: 30 }}>
					网页弹幕{" "}
					<Switch
						checked={showDanmu}
						onChange={val => {
							storageManager.set("showDanmu", val)
							setShowDanmu(val)
						}}
					/>
				</div>
			</div>
		</>
	)
}

export default Settings
