import React, { useState, useEffect } from "react"
import { Avatar, Button, Row, Col, message } from "antd"
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

function UserInfo({ account, user, messageUser }) {
	const [loading, setLoading] = useState(false)
	const [completeUserData, setCompleteUserData] = useState()
	const gutter = 10
	const isFollowing = account && account.followings.includes(user.id)
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

		fetchData()
	}, [user.id])
	const toggleFollow = async () => {
		setTogglingFollow(true)
		try {
			await follow(user.id, !isFollowing)

			if (isFollowing) {
				account.followings = account.followings.filter(f => {
					return f !== user.id
				})
				setCompleteUserData(u => {
					if (u) {
						return { ...u, followerCount: u.followerCount - 1 }
					}
				})
			} else {
				account.followings.push(user.id)

				setCompleteUserData(u => {
					if (u) {
						return { ...u, followerCount: u.followerCount + 1 }
					}
				})
			}
			storageManager.set("account", account)
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
			<div style={{ maxWidth: 250, margin: "auto" }}>
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
