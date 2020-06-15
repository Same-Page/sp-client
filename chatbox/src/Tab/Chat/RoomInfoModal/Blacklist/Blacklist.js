import React, { useEffect, useState } from "react"
import { message } from "antd"

import LoadingAlert from "components/Alert/LoadingAlert"
import { getBlacklistUsers } from "./service"
import AvatarWithPopover from "AvatarWithPopover"
function BlackList({ room }) {
	const [loading, setLoading] = useState(false)
	const [users, setUsers] = useState([])
	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true)
				const resp = await getBlacklistUsers(room.id)
				setUsers(resp.data)
			} catch (error) {
				message.error("载入失败！")
				console.error(error)
			}
			setLoading(false)
		}

		fetchData()
	}, [room.id])
	return (
		<>
			{loading && <LoadingAlert text="载入中。。。" />}

			{users.map(u => {
				return (
					<div key={u.id}>
						<AvatarWithPopover user={u} />
						<span style={{ marginLeft: 10 }}>{u.name}</span>
					</div>
				)
			})}
		</>
	)
}

export default BlackList
