import "./AvatarWithPopover.css"

import React, { useState } from "react"
import { Avatar, Popover, Button, Row, Col, message } from "antd"
import { connect } from "react-redux"

import {
	MailOutlined,
	// StopOutlined,
	// FlagOutlined,
	// UserAddOutlined,
	PlusOutlined,
	MinusOutlined
} from "@ant-design/icons"
import Profile from "components/Profile"
import { messageUser } from "redux/actions"
import { follow } from "./service"
import storageManager from "storage"

function AvatarWithPopover({
	account,
	user,
	size,
	messageUser,
	popoverPlacement
}) {
	const [popoverVisible, setPopoverVisible] = useState(false)
	const gutter = 10
	const isFollowing = account && account.followings.includes(user.id)
	const [togglingFollow, setToggleingFollow] = useState(false)
	const [followBtnOnHover, setFollowBtnOnHover] = useState(false)
	const toggleFollow = async () => {
		setToggleingFollow(true)
		try {
			if (isFollowing) {
				account.followings = account.followings.filter(f => {
					return f !== user.id
				})
			} else {
				account.followings.push(user.id)
			}
			storageManager.set("account", account)
			await follow(user.id, !isFollowing)
		} catch (error) {
			message.error("关注失败！")
			console.error(error)
		}
		setToggleingFollow(false)
	}
	let followBtnText = "关注"
	if (isFollowing) {
		if (!followBtnOnHover && !togglingFollow) {
			followBtnText = "已关注"
		} else {
			followBtnText = "取关"
		}
	}

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
									onMouseEnter={() => {
										setFollowBtnOnHover(true)
									}}
									onMouseLeave={() => {
										setFollowBtnOnHover(false)
									}}
									style={{ width: 80 }}
									// loading={togglingFollow}
									type={isFollowing ? "default" : "primary"}
									icon={!isFollowing && <PlusOutlined />}
									onClick={toggleFollow}
								>
									{followBtnText}
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

const stateToProps = state => {
	return {
		account: state.account
	}
}

export default connect(stateToProps, { messageUser })(AvatarWithPopover)
