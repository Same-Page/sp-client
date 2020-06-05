import "./Profile.css"

import React, { useState } from "react"
import { Row, Col, Button } from "antd"

import ProfileModal from "ProfileModal"

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

function Profile({
	aboutWidth,
	rowWidth,
	user,
	self,
	partial,
	gutter,
	setFollowView
}) {
	aboutWidth = aboutWidth || 200
	rowWidth = rowWidth || 200
	const [showProfileModal, setShowProfileModal] = useState(false)

	return (
		<>
			{showProfileModal && (
				<ProfileModal
					user={user}
					closeModal={() => {
						setShowProfileModal(false)
					}}
				/>
			)}
			<div className={self ? "sp-profile sp-self-profile" : "sp-profile"}>
				{user && user.about && (
					<div style={{ ...aboutStyle, width: aboutWidth }}>
						<span style={{ textAlign: "left", display: "inline-block" }}>
							{user.about}
						</span>
					</div>
				)}

				<div style={{ width: rowWidth, margin: "auto", textAlign: "center" }}>
					{partial && (
						<Button
							onClick={() => {
								setShowProfileModal(true)
							}}
							size="small"
							type="link"
							style={{ margin: "auto", fontSize: "small", display: "block" }}
						>
							详细资料
						</Button>
					)}
					{!partial && (
						<Row gutter={gutter} style={{ marginTop: 20 }}>
							<Col span={12}>
								<span className="sp-field-label">ID</span>
								<br />
								<b>{user && user.id} </b>
								{!user && <br />}
							</Col>
							<Col span={12}>
								<span
									onClick={() => {
										// props.showRooms()
									}}
								>
									<span className="sp-field-label">房间</span>
									<br />
									<b>{user && user.rooms && user.rooms.length} </b>
									{!user && <br />}
								</span>
							</Col>
						</Row>
					)}
					<Row gutter={gutter} style={{ textAlign: "center", marginTop: 10 }}>
						<Col span={12}>
							<span
								className="sp-follow-stats"
								onClick={() => {
									setFollowView && setFollowView("followings")
								}}
							>
								<span className="sp-field-label">关注了</span>
								<br />
								{/* {!partial && <br />} */}
								{/* {partial && <span style={{ marginRight: 5 }}></span>} */}
								<b>{user && user.followingCount} </b>
								{!user && <br />}
							</span>
						</Col>
						<Col span={12}>
							<span
								className="sp-follow-stats"
								onClick={() => {
									setFollowView && setFollowView("followers")
								}}
							>
								<span className="sp-field-label">关注者</span>
								<br />
								{/* {!partial && <br />} */}
								{/* {partial && <span style={{ marginRight: 5 }}></span>} */}
								<b>{user && user.followerCount} </b>
								{!user && <br />}
							</span>
						</Col>
					</Row>
				</div>
			</div>
		</>
	)
}

export default Profile
