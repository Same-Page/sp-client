import "./AvatarWithPopover.css"

import React, { useState, useEffect } from "react"
import { Avatar, Popover } from "antd"
import { connect } from "react-redux"

import UserInfo from "UserInfo"

function AvatarWithPopover({ activeTab, user, size, popoverPlacement }) {
	const [popoverVisible, setPopoverVisible] = useState(false)
	useEffect(() => {
		setPopoverVisible(false)
	}, [activeTab])
	return (
		<Popover
			overlayClassName="sp-user-info-popover"
			placement={popoverPlacement}
			visible={popoverVisible}
			onVisibleChange={setPopoverVisible}
			// mount and unmount <UserInfo /> to force refresh
			content={popoverVisible && <UserInfo user={user} />}
			trigger="click"
		>
			<Avatar
				style={{ cursor: "pointer" }}
				size={size || "large"}
				src={user.avatarSrc}
			/>
		</Popover>
	)
}

const stateToProps = state => {
	return {
		activeTab: state.activeTab
	}
}

export default connect(stateToProps)(AvatarWithPopover)
