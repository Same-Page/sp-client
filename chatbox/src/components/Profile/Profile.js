import "./Profile.css"

import React, { useState } from "react"
import { Row, Col, Button } from "antd"

import ProfileModal from "ProfileModal"

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
	const massageLink = url => {
		if (!url.startsWith("http")) {
			// TODO: can be improved
			return "https://" + url
		}
		return url
	}
	let className = "sp-profile"
	if (self) {
		className += " sp-self-profile"
	}
	if (partial) {
		className += " sp-partial-profile"
	}

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
			<div className={className}>
				{user && user.about && (
					<div style={{ maxWidth: aboutWidth }} className="sp-profile-about">
						<span
							style={{
								textAlign: "left",
								// block wouldn't show ellipsis
								display: partial ? "inline" : "inline-block"
							}}
						>
							{user.about}
						</span>
					</div>
				)}
				{!partial && user && user.website && (
					<span style={{ maxWidth: aboutWidth }} className="sp-profile-website">
						网站:{" "}
						<a
							rel="noopener noreferrer"
							target="_blank"
							href={massageLink(user.website)}
						>
							{user.website}
						</a>
					</span>
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
