import "./Follow.css"

import React, { useState, useEffect } from "react"
import { Radio, Button, message } from "antd"
import { LeftOutlined } from "@ant-design/icons"

import Header from "components/Header"
import { getFollowers, getFollowings } from "./service"
import LoadingAlert from "components/Alert/LoadingAlert"
import FollowRow from "./FollowRow"

function Follow({ view, setFollowView, back, followingCount, followerCount }) {
	const [loading, setLoading] = useState(false)
	const [followers, setFollowers] = useState()
	const [followings, setFollowings] = useState()
	useEffect(() => {
		async function fetchData() {
			try {
				if (view === "followers") {
					// if (!followers) {
					setLoading(true)
					const resp = await getFollowers()
					setFollowers(resp.data)
					// }
				} else {
					// if (!followings) {
					setLoading(true)

					const resp = await getFollowings()
					setFollowings(resp.data)
					// }
				}
			} catch (error) {
				message.error("载入失败！")
				console.error(error)
			}
			setLoading(false)
		}

		fetchData()
	}, [view, followingCount, followerCount])

	return (
		<>
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
				followings.map(u => <FollowRow key={u.id} user={u} />)}
			{view === "followers" &&
				followers &&
				followers.map(u => <FollowRow key={u.id} user={u} />)}
		</>
	)
}

export default Follow
