import React, { useState, useEffect } from "react"

import { Avatar } from "antd"
import { UserOutlined } from "@ant-design/icons"

import Profile from "components/Profile"
import AccountButtons from "./AccountButtons"
import Follow from "./Follow"

function Overview({ account }) {
	const [followView, setFollowView] = useState(false)

	const followerCount = account.followers.length
	const followingCount = account.followings.length

	return (
		<div className="sp-flex-body">
			{!followView && (
				<div style={{ width: 250, margin: "50px auto" }}>
					<Avatar
						style={{ display: "block", margin: "auto" }}
						size={128}
						src={account.avatarSrc}
						icon={<UserOutlined />}
					/>
					<center style={{ margin: 20 }}>
						<b>{account.name}</b>
					</center>
					<Profile
						self={true}
						user={account}
						followerCount={followerCount}
						followingCount={followingCount}
						setFollowView={setFollowView}
					/>
					<AccountButtons />
				</div>
			)}
			{followView && (
				<Follow
					view={followView}
					followerCount={followerCount}
					followingCount={followingCount}
					setFollowView={setFollowView}
					back={() => {
						setFollowView(false)
					}}
				/>
			)}
		</div>
	)
}

export default Overview
