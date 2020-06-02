import "./Follow.css"

import React, { useState, useEffect } from "react"
import { Radio, Button, message } from "antd"
import { LeftOutlined } from "@ant-design/icons"
import { connect } from "react-redux"

import Header from "components/Header"
import { getFollowers, getFollowings } from "./service"
import LoadingAlert from "components/Alert/LoadingAlert"
import FollowRow from "./FollowRow"
import ProfileModal from "ProfileModal"

function Follow({
	activeTab,
	view,
	setFollowView,
	back,
	followingCount,
	followerCount,
	setFollowingCount,
	setFollowerCount
}) {
	const [loading, setLoading] = useState(false)
	const [followers, setFollowers] = useState()
	const [followings, setFollowings] = useState()
	// showUserModal = the user to show in the modal
	// modal needs to be with Follow component so that
	// if unfollow, the modal won't be unmounted right away
	const [showUserModal, setShowUserModal] = useState(null)
	useEffect(() => {
		if (followings) {
			setFollowingCount(followings.length)
		}
	}, [followings])
	useEffect(() => {
		if (followers) {
			setFollowerCount(followers.length)
		}
	}, [followers])

	useEffect(() => {
		async function fetchData() {
			try {
				if (view === "followers") {
					setLoading(true)
					const resp = await getFollowers()
					setFollowers(resp.data)
				} else {
					setLoading(true)

					const resp = await getFollowings()
					setFollowings(resp.data)
				}
			} catch (error) {
				message.error("载入失败！")
				console.error(error)
			}
			setLoading(false)
		}

		fetchData()
	}, [view, followingCount, followerCount])
	useEffect(() => {
		setShowUserModal(false)
	}, [activeTab])
	return (
		<>
			{showUserModal && (
				<ProfileModal
					user={showUserModal}
					closeModal={() => {
						setShowUserModal(false)
					}}
				/>
			)}

			<Header
				leftItems={
					<>
						<Button icon={<LeftOutlined />} onClick={back} />
					</>
				}
				centerItems={
					<Radio.Group
						buttonStyle="solid"
						size="small"
						onChange={e => {
							setFollowView(e.target.value)
						}}
						value={view}
					>
						<Radio.Button value="followings">
							关注了 {followingCount}
						</Radio.Button>
						<Radio.Button value="followers">
							关注者 {followerCount}
						</Radio.Button>
					</Radio.Group>
				}
			/>
			{loading && <LoadingAlert text="载入中。。。" />}
			{view === "followings" &&
				followings &&
				followings.map(u => (
					<FollowRow setShowUserModal={setShowUserModal} key={u.id} user={u} />
				))}
			{view === "followers" &&
				followers &&
				followers.map(u => (
					<FollowRow setShowUserModal={setShowUserModal} key={u.id} user={u} />
				))}
		</>
	)
}

const stateToProps = state => {
	return {
		activeTab: state.activeTab,
		account: state.account
	}
}

export default connect(stateToProps)(Follow)
