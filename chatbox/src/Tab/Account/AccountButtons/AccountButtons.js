import React, { useState } from "react"

import { Button, Row, Col, Modal } from "antd"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import { logout } from "./service"
import storageManager from "storage"
const { confirm } = Modal

function AccountButtons() {
	const [loggingOut, setLoggingOut] = useState(false)
	return (
		<div style={{ width: 200, margin: "auto", marginTop: 30 }}>
			<Row gutter={50} style={{ textAlign: "center" }}>
				<Col style={{ textAlign: "center" }} span={12}>
					<Button
						type="primary"
						// size="large"
						//   onClick={props.showEditProfile}
					>
						修改资料
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
											storageManager.set("account", null)
										})
								},
								maskClosable: true
							})
						}}
						loading={loggingOut}
						type="danger"
					>
						登出
					</Button>
				</Col>
			</Row>
		</div>
	)
}

export default AccountButtons
