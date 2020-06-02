import React, { useState } from "react"

import { Avatar } from "antd"
import { UserOutlined } from "@ant-design/icons"

import Profile from "components/Profile"
import AccountButtons from "./AccountButtons"
import Follow from "./Follow"
import storageManager from "storage"

function Overview({ account }) {
	const [followView, setFollowView] = useState(false)

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
					<Profile self={true} user={account} setFollowView={setFollowView} />
					<AccountButtons />
				</div>
			)}
			{followView && (
				<Follow
					view={followView}
					followerCount={account.followerCount}
					followingCount={account.followingCount}
					setFollowerCount={num => {
						account.followerCount = num
						storageManager.set("account", account)
					}}
					setFollowingCount={num => {
						account.followingCount = num
						storageManager.set("account", account)
					}}
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
