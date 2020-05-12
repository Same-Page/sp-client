import "./ProfileModal.css"

import React from "react"
import { Modal, Row, Col, Button } from "antd"
import {
	MailOutlined,
	StopOutlined,
	FlagOutlined,
	UserAddOutlined
} from "@ant-design/icons"

import Profile from "components/Profile"

function ProfileModal({ user, messageUser, setShowModal }) {
	return (
		<Modal
			title="用户信息"
			visible={true}
			onCancel={() => {
				setShowModal(false)
			}}
			footer={null}
			className="sp-modal sp-profile-modal"
		>
			<Profile user={user} />
			<div style={{ width: 200, margin: "auto", marginTop: 30 }}>
				<Row gutter={50} style={{ textAlign: "center" }}>
					<Col style={{ textAlign: "center", marginBottom: 10 }} span={12}>
						<Button
							type="primary"
							icon={<UserAddOutlined />}
							onClick={() => {
								setShowModal(false)
							}}
						>
							关注
						</Button>
					</Col>
					<Col style={{ textAlign: "center" }} span={12}>
						<Button
							icon={<MailOutlined />}
							onClick={() => {
								setShowModal(false)
								messageUser(user)
							}}
						>
							私信
						</Button>
					</Col>
				</Row>

				<Row gutter={50} style={{ textAlign: "center" }}>
					<Col style={{ textAlign: "center" }} span={12}>
						<Button
							onClick={() => {
								setShowModal(false)
							}}
							type="danger"
							icon={<FlagOutlined />}
						>
							举报
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
