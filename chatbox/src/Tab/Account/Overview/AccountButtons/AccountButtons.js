import React, { useState } from "react"

import { Button, Row, Col, Modal } from "antd"
import {
	ExclamationCircleOutlined,
	EditOutlined,
	LogoutOutlined
} from "@ant-design/icons"
import { logout } from "./service"
import storageManager from "storage"
const { confirm } = Modal

function AccountButtons({ gutter, updateInfo, width }) {
	gutter = gutter || 10
	width = width || 250
	const [loggingOut, setLoggingOut] = useState(false)
	return (
		<div style={{ margin: "auto", width: width }}>
			<Row gutter={gutter} style={{ textAlign: "center" }}>
				<Col style={{ textAlign: "center" }} span={12}>
					<Button
						icon={<EditOutlined />}
						type="primary"
						// size="large"
						onClick={updateInfo}
					>
						编辑资料
					</Button>
				</Col>
				<Col style={{ textAlign: "center" }} span={12}>
					<Button
						onClick={() => {
							confirm({
								title: "确定登出?",
								icon: <ExclamationCircleOutlined />,
								cancelText: "取消",
								okText: "确定",
								centered: true,
								okButtonProps: { danger: true },

								// content: 'When clicked the OK button, this dialog will be closed after 1 second',
								onOk() {
									setLoggingOut(true)
									logout()
										.then(res => {
											//   window.spDebug("logout success")
										})
										.catch(err => {
											console.error(err)
										})
										.then(() => {
											setLoggingOut(false)
											console.log("logout, set account null")
											storageManager.set("account", null)
										})
								},
								maskClosable: true
							})
						}}
						loading={loggingOut}
						type="danger"
						icon={<LogoutOutlined />}
					>
						登出
					</Button>
				</Col>
			</Row>
		</div>
	)
}

export default AccountButtons
