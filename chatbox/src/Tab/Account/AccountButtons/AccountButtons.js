import React, { useState } from "react"

import { Button, Row, Col } from "antd"
import { logout } from "./service"
import storageManager from "storage"

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
