import React, { useState, useEffect } from "react"
import { Avatar, Button, Row, Col, message, Skeleton } from "antd"
import { connect } from "react-redux"

import {
	MailOutlined,
	PlusOutlined,
	UserOutlined,
	MinusOutlined,
	LoadingOutlined
} from "@ant-design/icons"
import Profile from "components/Profile"
import { messageUser } from "redux/actions"
import { follow, getUser } from "./service"
import storageManager from "storage"

function UserInfo({ account, user, messageUser, visible }) {
	const [loading, setLoading] = useState(false)
	const [completeUserData, setCompleteUserData] = useState()
	const gutter = 10
	const isFollowing = completeUserData && completeUserData.isFollowing
	const [togglingFollow, setTogglingFollow] = useState(false)
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
		if (user && visible) {
			fetchData()
		}
		// put visible here to force refresh data
	}, [user, visible])
	const toggleFollow = async () => {
		setTogglingFollow(true)
		try {
			await follow(user.id, !isFollowing)
			// maybe it's better to let backend return new number
			if (isFollowing) {
				setCompleteUserData(u => {
					if (u) {
						return {
							...u,
							followerCount: u.followerCount - 1,
							isFollowing: false
						}
					}
				})
				account.followingCount--
				storageManager.set("account", account)
			} else {
				setCompleteUserData(u => {
					if (u) {
						return {
							...u,
							followerCount: u.followerCount + 1,
							isFollowing: true
						}
					}
				})
				account.followingCount++
				storageManager.set("account", account)
			}
		} catch (error) {
			message.error("关注失败！")
			console.error(error)
		}
		setTogglingFollow(false)
	}
	let followIcon = <PlusOutlined />
	let followBtnText = "关注"
	if (isFollowing) {
		if (!followBtnOnHover && !togglingFollow) {
			followBtnText = "已关注"
			followIcon = ""
		} else {
			followBtnText = "取关"
			followIcon = <MinusOutlined />
		}
	}

	return (
		<div>
			{loading && <LoadingOutlined style={{ position: "absolute" }} />}
			<div style={{ width: 200, margin: "auto" }}>
				<Avatar
					style={{ display: "block", margin: "auto" }}
					size={128}
					src={user.avatarSrc}
					icon={<UserOutlined />}
				/>
				<center style={{ margin: 20 }}>
					<b>{user.name}</b>
				</center>

				<Skeleton active loading={loading && !completeUserData}>
					<Profile user={completeUserData} gutter={gutter} self={false} />

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
									loading={togglingFollow}
									type={isFollowing ? "default" : "primary"}
									icon={followIcon}
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
									}}
								>
									私信
								</Button>
							</Col>
						</Row>
					</div>
				</Skeleton>
			</div>
		</div>
	)
}

const stateToProps = state => {
	return {
		account: state.account
	}
}

export default connect(stateToProps, { messageUser })(UserInfo)
