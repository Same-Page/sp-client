import "./UserInfo.css"

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

// This is only for other users, not for displaying info of logged in user
// Profile componnent is shared
function UserInfo({
	aboutWidth,
	rowWidth,
	account,
	user,
	messageUser,
	visible,
	close,
	partial
}) {
	const [loading, setLoading] = useState(false)
	const [completeUserData, setCompleteUserData] = useState()
	const gutter = 10
	const isFollowing = completeUserData && completeUserData.isFollowing
	const mutualFollow = isFollowing && completeUserData.isFollower
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
		if (togglingFollow) return
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
			if (mutualFollow) {
				followBtnText = "互相关注"
			}
			followIcon = ""
		} else {
			followBtnText = "取关"
			followIcon = <MinusOutlined />
		}
	}
	if (togglingFollow) {
		followIcon = <LoadingOutlined />
	}
	let avatarSrc = user && user.avatarSrc
	let username = user && user.name
	if (completeUserData) {
		// more up to date data
		avatarSrc = completeUserData.avatarSrc
		username = completeUserData.name
	}

	return (
		<>
			{/* loading icon is outside width restriction for profile modal's sake */}
			{loading && <LoadingOutlined style={{ position: "absolute" }} />}

			<div
				className="sp-user-info"
				style={{ width: Math.max(aboutWidth, rowWidth), margin: "auto" }}
			>
				<Avatar
					style={{ display: "block", margin: "auto" }}
					size={partial ? 96 : 128}
					src={avatarSrc}
					icon={<UserOutlined />}
				/>
				<center style={{ margin: "20px 20px 0px 20px" }}>
					<b>{username}</b>
				</center>

				<Skeleton
					active
					paragraph={{ rows: partial ? 3 : 5, width: "100%" }}
					loading={loading && !completeUserData}
				>
					<Profile
						aboutWidth={aboutWidth}
						rowWidth={rowWidth}
						user={completeUserData}
						gutter={gutter}
						self={false}
						partial={partial}
					/>

					<div style={{ margin: "auto", width: rowWidth, marginTop: 20 }}>
						<Row gutter={gutter} style={{ textAlign: "center" }}>
							<Col style={{ textAlign: "center", marginBottom: 10 }} span={12}>
								<Button
									onMouseEnter={() => {
										setFollowBtnOnHover(true)
									}}
									onMouseLeave={() => {
										setFollowBtnOnHover(false)
									}}
									// style={{ width: 80 }}
									// not using loading attribute because of
									// delayed animation which shift space
									// loading={togglingFollow}
									// disabled={togglingFollow}
									type={isFollowing ? "default" : "primary"}
									icon={followIcon}
									onClick={toggleFollow}
									// size={partial ? "small" : "middle"}
								>
									{followBtnText}
								</Button>
							</Col>
							<Col style={{ textAlign: "center" }} span={12}>
								<Button
									icon={<MailOutlined />}
									onClick={() => {
										close && close()
										messageUser(user)
									}}
									// size={partial ? "small" : "middle"}
								>
									私信
								</Button>
							</Col>
						</Row>
					</div>
				</Skeleton>
			</div>
		</>
	)
}

const stateToProps = state => {
	return {
		account: state.account
	}
}

export default connect(stateToProps, { messageUser })(UserInfo)
