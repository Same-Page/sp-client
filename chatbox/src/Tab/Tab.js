import "antd/dist/antd.css"
import "./Tab.css"
import React from "react"
import { Tabs, message } from "antd"
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
				<TabPane tab={<MessageOutlined title="实时聊天" />} key="chat">
					<Chat account={account} />
				</TabPane>
				<TabPane tab={<EditOutlined title="网页留言" />} key="comment">
					comment
				</TabPane>
				<TabPane tab={<MailOutlined title="收件箱" />} key="inbox">
					<Inbox account={account} />
				</TabPane>
				<TabPane tab={<UserOutlined title="个人资料" />} key="account">
					<Account account={account} />
				</TabPane>
				<TabPane tab={<SettingOutlined title="设置" />} key="settings">
					Content of Tab Pane 4
				</TabPane>
			</Tabs>
		</div>
	)
}

export default Tab
