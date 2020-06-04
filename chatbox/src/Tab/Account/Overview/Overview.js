import React, { useState } from "react"

import { Avatar, Button } from "antd"

import {
	ReloadOutlined,
	LoadingOutlined,
	LockOutlined,
	UserOutlined,
	SettingOutlined
} from "@ant-design/icons"

import Profile from "components/Profile"
import AccountButtons from "./AccountButtons"
import Follow from "./Follow"
import UpdateInfo from "./UpdateInfo"
import Header from "components/Header"

function Overview({ account }) {
	// view: profile, followers/followings, edit-profile
	const [view, setView] = useState("profile")
	const [loading, setLoading] = useState(false)
	return (
		<div className="sp-flex-body">
			{view === "profile" && (
				<>
					<Header
						leftItems={
							<>
								<Button icon={<LockOutlined />}>
									<span>修改密码</span>
								</Button>
								{/* <span style={{ marginLeft: 10 }}>个人主页</span> */}
								{/* <Button
									icon={loading ? <LoadingOutlined /> : <ReloadOutlined />}
									onClick={() => {
										// fetchData()
									}}
								/> */}
							</>
						}
						centerItems="个人资料"
						rightItems={
							<Button icon={<SettingOutlined />}>
								<span>设置</span>
							</Button>
						}
					/>
					<div
						style={{
							padding: "30px 10px",
							overflowY: "auto"
						}}
					>
						<Avatar
							title="点击更换头像"
							style={{ display: "block", margin: "auto", cursor: "pointer" }}
							size={128}
							src={account.avatarSrc}
							icon={<UserOutlined />}
							onClick={() => {
								setView("edit-profile")
							}}
						/>
						<center style={{ margin: "20px auto 10px auto" }}>
							<b>{account.name}</b>
						</center>

						<Profile
							aboutWidth={300}
							rowWidth={250}
							self={true}
							user={account}
							setFollowView={setView}
						/>
						<br />
						<br />
						<AccountButtons
							width={250}
							updateInfo={() => {
								setView("edit-profile")
							}}
						/>
					</div>
				</>
			)}
			{(view === "followings" || view === "followers") && (
				<Follow
					view={view}
					followerCount={account.followerCount}
					followingCount={account.followingCount}
					setFollowView={setView}
					back={() => {
						setView("profile")
					}}
				/>
			)}
			{view === "edit-profile" && (
				<UpdateInfo
					account={account}
					back={() => {
						setView("profile")
					}}
				/>
			)}
		</div>
	)
}

export default Overview
