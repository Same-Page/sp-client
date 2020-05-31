import React, { useState } from "react"

import { Avatar } from "antd"
import { UserOutlined } from "@ant-design/icons"

import Profile from "components/Profile"
import Login from "./Login"
import Signup from "./Signup"
import AccountButtons from "./AccountButtons"

function Account({ account }) {
	const [signup, setSignup] = useState(false)

	if (account) {
		const followerCount = account.followers.length
		const followingCount = account.followings.length
		return (
			<div className="sp-flex-body">
				<div style={{ width: 250, margin: "50px auto" }}>
					<Avatar
						style={{ display: "block", margin: "auto" }}
						size={128}
						// shape="square"
						src={account.avatarSrc}
						icon={<UserOutlined />}
					/>
					<center style={{ margin: 20 }}>
						<b>{account.name}</b>
					</center>
					<Profile
						user={account}
						followerCount={followerCount}
						followingCount={followingCount}
					/>
					<AccountButtons />
				</div>
			</div>
		)
	}

	if (signup) {
		return (
			<Signup
				login={() => {
					setSignup(false)
				}}
			/>
		)
	}

	return (
		<Login
			signup={() => {
				setSignup(true)
			}}
		/>
	)
}

export default Account
