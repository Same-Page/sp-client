import "./AvatarWithPopover.css"

import React, { useState, useEffect } from "react"
import { Avatar, Popover, Button, Row, Col, message } from "antd"
import { connect } from "react-redux"

import {
	MailOutlined,
	PlusOutlined,
	UserOutlined,
	LoadingOutlined
} from "@ant-design/icons"
import Profile from "components/Profile"
import { messageUser } from "redux/actions"
import { follow, getUser } from "./service"
import storageManager from "storage"

function AvatarWithPopover({
	account,
	user,
	size,
	messageUser,
	popoverPlacement
}) {
	const [popoverVisible, setPopoverVisible] = useState(false)
	const [loading, setLoading] = useState(false)
	const [completeUserData, setCompleteUserData] = useState()
	const gutter = 10
	const isFollowing = account && account.followings.includes(user.id)
	const [togglingFollow, setToggleingFollow] = useState(false)
	const [followBtnOnHover, setFollowBtnOnHover] = useState(false)

	useEffect(() => {
		async function fetchData() {
			setLoading(true)
			try {
				const resp = await getUser(user.id)
				setCompleteUserData(resp.data)
			} catch (error) {
				message.error("载入失败！")
				console.error(error)
			}
			setLoading(false)
		}

		if (popoverVisible && !completeUserData) {
			fetchData()
		}
	}, [popoverVisible, completeUserData, user.id])
	const toggleFollow = async () => {
		setToggleingFollow(true)
		try {
			if (isFollowing) {
				account.followings = account.followings.filter(f => {
					return f !== user.id
				})
				setCompleteUserData(u => {
					return { ...u, followerCount: u.followerCount - 1 }
				})
			} else {
				account.followings.push(user.id)
				setCompleteUserData(u => {
					return { ...u, followerCount: u.followerCount + 1 }
				})
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
					{loading && <LoadingOutlined style={{ position: "absolute" }} />}

					<Avatar
						style={{ display: "block", margin: "auto" }}
						size={128}
						src={user.avatarSrc}
						icon={<UserOutlined />}
					/>
					<center style={{ margin: 20 }}>
						<b>{user.name}</b>
					</center>

					<Profile
						user={completeUserData}
						followerCount={completeUserData && completeUserData.followerCount}
						followingCount={completeUserData && completeUserData.followingCount}
						gutter={gutter}
						self={false}
					/>

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
