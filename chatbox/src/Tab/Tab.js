import "antd/dist/antd.css"
import "./Tab.css"
import React, { useState, useEffect } from "react"
import { Tabs, message, Badge } from "antd"
import {
	MessageOutlined,
	MailOutlined,
	UserOutlined,
	// SettingOutlined,
	CloseOutlined,
	EditOutlined
} from "@ant-design/icons"

import Account from "./Account"
import Chat from "./Chat"
import Inbox from "./Inbox"
import Comment from "./Comment"

const { TabPane } = Tabs

message.config({
	top: 100,
	duration: 2,
	maxCount: 3
})

function Tab({
	account,
	socket,
	activeTab,
	setActiveTab,
	storageData,
	unread,
	url,
	domain
}) {
	const [windowSize, setWindowSize] = useState({
		height: window.innerHeight,
		width: window.innerWidth
	})
	const [minChatMode, setMinChatMode] = useState(false)

	useEffect(() => {
		const resizeHandler = () => {
			setWindowSize({
				height: window.innerHeight,
				width: window.innerWidth
			})
		}
		window.addEventListener("resize", resizeHandler)

		return () => {
			window.removeEventListener("resize", resizeHandler)
		}
	}, [])

	useEffect(() => {
		setMinChatMode(activeTab === "chat" && windowSize.height < 150)
	}, [windowSize, activeTab])

	let className = "sp-main-tabs"
	if (minChatMode) {
		className += " min-chat-mode"
	}
	return (
		<div className={className}>
			{!minChatMode && (
				<CloseOutlined
					onClick={() => {
						if (window.parent) {
							window.parent.postMessage(
								{
									action: "close_chatbox",
									data: null
								},
								"*"
							)
						}
					}}
					className="sp-close-btn"
					title="隐藏聊天盒"
				/>
			)}

			<Tabs
				onChange={key => {
					if (key === "close") {
						if (window.parent) {
							window.parent.postMessage(
								{
									action: "close_chatbox",
									data: null
								},
								"*"
							)
						}

						return
					}
					setActiveTab(key)
				}}
				type="card"
				activeKey={activeTab}
			>
				<TabPane
					// forceRender
					tab={
						<span>
							<MessageOutlined title="实时聊天" />
							聊天
						</span>
					}
					key="chat"
				>
					<Chat
						storageData={storageData}
						account={account}
						socket={socket}
						url={url}
						domain={domain}
						setActiveTab={setActiveTab}
						windowSize={windowSize}
					/>
				</TabPane>
				<TabPane
					tab={
						<span>
							<EditOutlined title="网页留言" />
							留言
						</span>
					}
					key="comment"
				>
					<Comment account={account} url={url} />
				</TabPane>
				<TabPane
					tab={
						<span>
							<Badge dot={unread} className="sp-new-message-dot">
								<MailOutlined title="收件箱" />
							</Badge>
							私信
						</span>
					}
					key="inbox"
				>
					<Inbox account={account} storageData={storageData} />
				</TabPane>
				<TabPane
					tab={
						<span>
							<UserOutlined title="账号信息与偏好设置" />
							账号
						</span>
					}
					key="account"
				>
					<Account account={account} storageData={storageData} />
				</TabPane>
				{/* <TabPane
					tab={
						<span>
							<CloseOutlined title="关闭聊天盒" />
							关闭
						</span>
					}
					key="close"
				>
					<>close</>
				</TabPane> */}
				{/* <TabPane
					tab={
						<span>
							<SettingOutlined title="设置" />
							设置
						</span>
					}
					key="settings"
				>
					Content of Tab Pane 4
				</TabPane> */}
			</Tabs>
		</div>
	)
}

export default Tab
