import React from "react"
import moment from "moment"
import { Avatar, Button } from "antd"
import { ReloadOutlined } from "@ant-design/icons"
import LoadingAlert from "components/LoadingAlert"
import Header from "components/Header"

function lastMsg(conversation) {
	const messages = conversation.messages
	if (messages.length > 0) {
		return messages[messages.length - 1]
	}
	return null
}

function OverviewTab({ conversations, setInboxUser, loading, fetchData }) {
	return (
		<div className="sp-flex-body sp-inbox-tab">
			<Header
				leftItems={
					<>
						<Button icon={<ReloadOutlined />} onClick={fetchData} />
					</>
				}
				centerItems={<span>3条未读信息</span>}
			/>
			{loading && <LoadingAlert text="载入中。。。" />}
			{conversations.map(c => (
				<div
					className="sp-inbox-item"
					onClick={() => {
						setInboxUser(c.user)
					}}
					key={c.user.id.toString()}
				>
					<Avatar shape="square" size="large" src={c.user.avatarSrc} />
					<span className="sp-inbox-item-right">
						<div className="sp-username-msgtime-row">
							<span className="sp-username">{c.user.name}</span>
							{lastMsg(c) && (
								<span className="sp-lastmsg-time">
									{moment(lastMsg(c).created_at).fromNow()}
								</span>
							)}
						</div>
						<div className="sp-lastmsg-content">
							{(lastMsg(c) && lastMsg(c).content.value) || "..."}
						</div>
					</span>
					<div style={{ clear: "both" }}></div>
				</div>
			))}
		</div>
	)
}

export default OverviewTab
