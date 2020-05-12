import "antd/dist/antd.css"
import "./Tab.css"
import React from "react"
import { Tabs, Space, message } from "antd"
import {
	MessageOutlined,
	MailOutlined,
	UserOutlined,
	SettingOutlined,
	EditOutlined
} from "@ant-design/icons"

import Account from "./Account"
import Chat from "./Chat"
import Inbox from "./Inbox"

const { TabPane } = Tabs

function callback(key) {
	// console.log(key)
}
message.config({
	top: 100,
	duration: 2,
	maxCount: 3
})
function Tab({ account }) {
	return (
		<div className="sp-main-tabs">
			<Tabs onChange={callback} type="card" defaultActiveKey="inbox">
				<TabPane
					tab={
						<span>
							<MessageOutlined title="实时聊天" />
							聊天
						</span>
					}
					key="chat"
				>
					<Chat account={account} />
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
					comment
				</TabPane>
				<TabPane
					tab={
						<span>
							<MailOutlined title="收件箱" />
							信箱
						</span>
					}
					key="inbox"
				>
					<Inbox account={account} />
				</TabPane>
				<TabPane
					tab={
						<span>
							<UserOutlined title="个人资料" />
							用户
						</span>
					}
					key="account"
				>
					<Account account={account} />
				</TabPane>
				<TabPane
					tab={
						<span>
							<SettingOutlined title="设置" />
							设置
						</span>
					}
					key="settings"
				>
					Content of Tab Pane 4
				</TabPane>
			</Tabs>
		</div>
	)
}

export default Tab
