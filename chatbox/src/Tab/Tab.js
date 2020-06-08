import "antd/dist/antd.css"
import "./Tab.css"
import React from "react"
import { Tabs, message } from "antd"
import {
	MessageOutlined,
	MailOutlined,
	UserOutlined,
	// SettingOutlined,
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

function Tab({ account, activeTab, setActiveTab, storageData, url, domain }) {
	return (
		<div className="sp-main-tabs">
			<Tabs
				onChange={key => {
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
						url={url}
						domain={domain}
						setActiveTab={setActiveTab}
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
							<MailOutlined title="收件箱" />
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
					<Account account={account} />
				</TabPane>
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
