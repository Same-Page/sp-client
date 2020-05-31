import React from "react"
import { Row, Col } from "antd"

// const avatarStyle = {
// 	display: "block",
// 	margin: "auto"
// 	// width: "100%",
// 	// height: "auto",
// 	// borderRadius: 0
// }
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

function Profile({ user, self, gutter, followerCount, followingCount }) {
	return (
		<div>
			<Row gutter={gutter} style={{ textAlign: "center" }}>
				<Col style={{ textAlign: "center" }} span={12}>
					ID <br />
					<b>{user && user.id} </b>
					{!user && <br />}
				</Col>
				<Col style={{ textAlign: "center" }} span={12}>
					<span
						className="sp-follow-stats"
						onClick={() => {
							// props.showRooms()
						}}
					>
						房间
						<br /> <b>{user && user.rooms && user.rooms.length} </b>
						{!user && <br />}
					</span>
				</Col>
			</Row>
			<Row gutter={gutter} style={{ marginTop: 10, textAlign: "center" }}>
				<Col style={{ textAlign: "center" }} span={12}>
					<span
						className="sp-follow-stats"
						// onClick={props.showFollowings}
					>
						关注了
						<br /> <b>{followingCount} </b>
						{!user && <br />}
					</span>
				</Col>
				<Col style={{ textAlign: "center" }} span={12}>
					<span
						className="sp-follow-stats"
						// onClick={props.showFollowers}
					>
						关注者
						<br /> <b>{followerCount} </b>
						{!user && <br />}
					</span>
				</Col>
			</Row>
			{false && (
				<span>
					<Row gutter={gutter} style={{ marginTop: 10, textAlign: "center" }}>
						<Col style={{ textAlign: "center" }} span={12}>
							<span
								className="sp-follow-stats"
								onClick={() => {
									// props.showRooms()
								}}
							>
								房间
								<br /> <b>{user.rooms && user.rooms.length}</b>
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
				</span>
			)}
			{user && user.about && <div style={aboutStyle}>{user.about}</div>}
		</div>
	)
}

export default Profile
