import "./Profile.css"

import React from "react"
import { Row, Col } from "antd"

const aboutStyle = {
	// borderBottom: "1px solid lightgray",
	textAlign: "center",
	overflow: "auto",
	fontSize: "small",
	color: "gray",
	maxHeight: 72,
	padding: 5,
	paddingLeft: 10,
	paddingRight: 10,
	wordBreak: "break-word",
	margin: "auto"
}

function Profile({ aboutWidth, rowWidth, user, self, gutter, setFollowView }) {
	aboutWidth = aboutWidth || 200
	rowWidth = rowWidth || 200
	return (
		<div className={self ? "sp-self-profile" : ""}>
			{user && user.about && (
				<div style={{ ...aboutStyle, width: aboutWidth }}>
					<span style={{ textAlign: "left", display: "inline-block" }}>
						{user.about}
					</span>
				</div>
			)}
			<div style={{ width: rowWidth, margin: "auto" }}>
				<Row gutter={gutter} style={{ textAlign: "center", marginTop: 20 }}>
					<Col style={{ textAlign: "center" }} span={12}>
						ID <br />
						<b>{user && user.id} </b>
						{!user && <br />}
					</Col>
					<Col style={{ textAlign: "center" }} span={12}>
						<span
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
							onClick={() => {
								setFollowView && setFollowView("followings")
							}}
						>
							关注了
							<br /> <b>{user && user.followingCount} </b>
							{!user && <br />}
						</span>
					</Col>
					<Col style={{ textAlign: "center" }} span={12}>
						<span
							className="sp-follow-stats"
							onClick={() => {
								setFollowView && setFollowView("followers")
							}}
						>
							关注者
							<br /> <b>{user && user.followerCount} </b>
							{!user && <br />}
						</span>
					</Col>
				</Row>
			</div>
		</div>
	)
}

export default Profile
