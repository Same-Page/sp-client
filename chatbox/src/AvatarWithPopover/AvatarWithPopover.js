import "./AvatarWithPopover.css"

import React, { useState } from "react"
import { Avatar, Popover, Button, Row, Col } from "antd"
import { connect } from "react-redux"

import {
	MailOutlined,
	// StopOutlined,
	// FlagOutlined,
	UserAddOutlined
} from "@ant-design/icons"
import Profile from "components/Profile"
import { messageUser } from "redux/actions"

function AvatarWithPopover({ user, size, messageUser, popoverPlacement }) {
	const [popoverVisible, setPopoverVisible] = useState(false)
	const gutter = 10
	return (
		<Popover
			overlayClassName="sp-user-info-popover"
			placement={popoverPlacement}
			visible={popoverVisible}
			onVisibleChange={setPopoverVisible}
			content={
				<div>
					<Profile user={user} gutter={gutter} self={false} />
					<div style={{ margin: "auto", marginTop: 20 }}>
						<Row gutter={gutter} style={{ textAlign: "center" }}>
							<Col style={{ textAlign: "center", marginBottom: 10 }} span={12}>
								<Button
									type="primary"
									icon={<UserAddOutlined />}
									onClick={() => {}}
								>
									关注
								</Button>
							</Col>
							<Col style={{ textAlign: "center" }} span={12}>
								<Button
									icon={<MailOutlined />}
									onClick={() => {
										messageUser(user)
										setPopoverVisible(false)
									}}
								>
									私信
								</Button>
							</Col>
						</Row>
					</div>
				</div>
			}
			trigger="click"
		>
			<Avatar
				// onClick={() => {
				// 	setShowModal(true)
				// }}
				style={{ cursor: "pointer" }}
				size={size || "large"}
				src={user.avatarSrc}
			/>
		</Popover>
	)
}

export default connect(null, { messageUser })(AvatarWithPopover)
