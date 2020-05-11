import "./ProfileModal.css"

import React from "react"
import { Modal, Row, Col, Button } from "antd"
import { MailOutlined, StopOutlined } from "@ant-design/icons"

import Profile from "components/Profile"

function ProfileModal({ user, setShowModal }) {
	return (
		<Modal
			title="用户信息"
			visible={true}
			onCancel={() => {
				setShowModal(false)
			}}
			footer={null}
			className="sp-profile-modal"
		>
			<Profile user={user} />
			<div style={{ width: 200, margin: "auto", marginTop: 30 }}>
				<Row gutter={50} style={{ textAlign: "center" }}>
					<Col style={{ textAlign: "center" }} span={12}>
						<Button
							type="primary"
							icon={<MailOutlined />}
							onClick={() => {
								setShowModal(false)
							}}
						>
							私信
						</Button>
					</Col>
					<Col style={{ textAlign: "center" }} span={12}>
						<Button
							onClick={() => {
								setShowModal(false)
							}}
							type="danger"
							icon={<StopOutlined />}
						>
							屏蔽
						</Button>
					</Col>
				</Row>
			</div>
		</Modal>
	)
}

export default ProfileModal
