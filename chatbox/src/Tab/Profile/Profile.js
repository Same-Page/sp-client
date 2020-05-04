import React from "react"
import { Avatar, Row, Col } from "antd"
import { UserOutlined } from "@ant-design/icons"

const avatarStyle = {
	display: "block",
	margin: "auto",
	marginTop: 30
	// width: "100%",
	// height: "auto",
	// borderRadius: 0
}
const aboutStyle = {
	display: "inline-block",
	minWidth: 200,
	maxWidth: 350,
	borderBottom: "1px solid lightgray",
	textAlign: "left",
	overflow: "auto",
	maxHeight: 72,
	padding: 5,
	paddingLeft: 10,
	paddingRight: 10,
	wordBreak: "break-word",
	marginTop: 20
}

function Profile({ account }) {
	return (
		<div>
			<div className="sp-tab-header">{account.name}</div>

			<Avatar
				style={avatarStyle}
				size={128}
				// shape="square"
				src={account.avatarSrc}
				icon={<UserOutlined />}
			/>

			<div style={{ width: 200, margin: "auto", marginTop: 30 }}>
				<Row gutter={50} style={{ textAlign: "center" }}>
					<Col style={{ textAlign: "center" }} span={12}>
						ID <br />
						<b>{account.id}</b>
					</Col>
					<Col style={{ textAlign: "center" }} span={12}>
						积分 <br />
						<b>{account.credit}</b>
					</Col>
				</Row>

				<Row gutter={50} style={{ marginTop: 10, textAlign: "center" }}>
					<Col style={{ textAlign: "center" }} span={12}>
						<span
							className="sp-follow-stats"
							// onClick={props.showFollowings}
						>
							关注了
							<br /> <b>{account.followingCount}</b>
						</span>
					</Col>
					<Col style={{ textAlign: "center" }} span={12}>
						<span
							className="sp-follow-stats"
							// onClick={props.showFollowers}
						>
							关注者
							<br /> <b>{account.followerCount}</b>
						</span>
					</Col>
				</Row>
				<Row gutter={50} style={{ marginTop: 10, textAlign: "center" }}>
					<Col style={{ textAlign: "center" }} span={12}>
						<span
							className="sp-follow-stats"
							onClick={() => {
								// props.showRooms()
							}}
						>
							房间
							<br /> <b>{account.rooms && account.rooms.length}</b>
						</span>
					</Col>
					<Col style={{ textAlign: "center" }} span={12}>
						<span
							className="sp-follow-stats"
							onClick={() => {
								// props.showBlacklist()
							}}
						>
							黑名单
							{/* <br /> <b>{props.blacklist.length}</b> */}
						</span>
					</Col>
				</Row>
				<div style={aboutStyle}>{account.about}</div>
			</div>
		</div>
	)
}

export default Profile
