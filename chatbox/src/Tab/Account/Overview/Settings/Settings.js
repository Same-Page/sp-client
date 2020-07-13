import React, { useEffect, useState } from "react"
import { Button, Switch } from "antd"
import { LeftOutlined } from "@ant-design/icons"

import Header from "components/Header"
import storageManager from "storage"

// import { changePassword } from "./service"

function Settings({ back, storageData }) {
	// const [loading, setLoading] = useState(false)
	const [showAvatar, setShowAvatar] = useState(false)
	const [showDanmu, setShowDanmu] = useState(true)
	const [showChatIcon, setShowChatIcon] = useState(true)
	const [autoConnect, setAutoConnect] = useState(true)

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
		if (window.parent) {
			window.parent.postMessage(
				{
					name: "get_settings",
					data: null
				},
				"*"
			)
			window.addEventListener("message", e => {
				if (!e || !e.data) return
				const data = e.data
				// console.log(data)
				if (data.name === "show_avatar") {
					setShowAvatar(data.data)
				}
				if (data.name === "show_danmu") {
					setShowDanmu(data.data)
				}
				if (data.name === "show_icon") {
					setShowChatIcon(data.data)
				}
				if (data.name === "auto_connect") {
					setAutoConnect(data.data)
				}
			})
		}

		if (storageData) {
			// storageData doesn't work if chatbox iframe not same origin
			// injection script
			// if (storageData.showAvatar != null) {
			// 	setShowAvatar(storageData.showAvatar)
			// }
			// if (storageData.showDanmu != null) {
			// 	setShowDanmu(storageData.showDanmu)
			// }
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
				<div style={{ marginTop: 10 }}>
					自动连接
					<Switch
						style={{ marginLeft: 10 }}
						checked={autoConnect}
						onChange={val => {
							storageManager.set("autoConnect", val)
							setAutoConnect(val)
						}}
					/>
				</div>
				<div style={{ marginTop: 30 }}>
					显示聊天图标
					<Switch
						style={{ marginLeft: 10 }}
						checked={showChatIcon}
						onChange={val => {
							storageManager.set("showChatIcon", val)
							setShowChatIcon(val)
						}}
					/>
				</div>

				<div style={{ marginTop: 30 }}>
					显示弹幕
					<Switch
						style={{ marginLeft: 10 }}
						checked={showDanmu}
						onChange={val => {
							storageManager.set("showDanmu", val)
							setShowDanmu(val)
						}}
					/>
				</div>
				<div style={{ marginTop: 30 }}>
					网页底部显示用户
					<Switch
						style={{ marginLeft: 10 }}
						checked={showAvatar}
						onChange={val => {
							storageManager.set("showAvatar", val)
							setShowAvatar(val)
						}}
					/>
				</div>
			</div>
		</>
	)
}

export default Settings
