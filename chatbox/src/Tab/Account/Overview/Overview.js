import React, { useState } from "react"

import { Avatar, Button } from "antd"

import { LockOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons"

import Profile from "components/Profile"
import AccountButtons from "./AccountButtons"
import Follow from "./Follow"
import UpdateInfo from "./UpdateInfo"
import Header from "components/Header"
import ChangePassword from "./ChangePassword"
import Settings from "./Settings"
import Rooms from "./Rooms"

function Overview({ account, storageData }) {
	// view: profile, followers/followings, edit-profile, change-password, settings
	const [view, setView] = useState("profile")
	const back = () => {
		setView("profile")
	}
	return (
		<div className="sp-flex-body">
			{view === "profile" && (
				<>
					<Header
						leftItems={
							<>
								<span style={{ marginLeft: 10 }}>
									{/* <UserOutlined style={{ marginRight: 5 }} /> */}
									个人主页
								</span>
							</>
						}
						// centerItems="个人资料"
						rightItems={
							<>
								<Button
									onClick={() => {
										setView("change-password")
									}}
									icon={<LockOutlined />}
								>
									<span>修改密码</span>
								</Button>
								<Button
									onClick={() => {
										setView("settings")
									}}
									icon={<SettingOutlined />}
								>
									<span>设置</span>
								</Button>
							</>
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
							setView={setView}
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
					back={back}
				/>
			)}
			{view === "edit-profile" && <UpdateInfo account={account} back={back} />}
			{view === "change-password" && <ChangePassword back={back} />}
			{view === "settings" && (
				<Settings back={back} storageData={storageData} />
			)}
			{view === "rooms" && <Rooms account={account} back={back} />}
		</div>
	)
}

export default Overview
