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
						<Space>
							<MessageOutlined title="实时聊天" />
							聊天
						</Space>
					}
					key="chat"
				>
					<Chat account={account} />
				</TabPane>
				<TabPane
					tab={
						<Space>
							<EditOutlined title="网页留言" />
							留言
						</Space>
					}
					key="comment"
				>
					comment
				</TabPane>
				<TabPane
					tab={
						<Space>
							<MailOutlined title="收件箱" />
							信箱
						</Space>
					}
					key="inbox"
				>
					<Inbox account={account} />
				</TabPane>
				<TabPane
					tab={
						<Space>
							<UserOutlined title="个人资料" />
							用户
						</Space>
					}
					key="account"
				>
					<Account account={account} />
				</TabPane>
				<TabPane
					tab={
						<Space>
							<SettingOutlined title="设置" />
							设置
						</Space>
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
