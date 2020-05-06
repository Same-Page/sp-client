import "antd/dist/antd.css"
import "./Tab.css"
import React from "react"
import { Tabs } from "antd"
import {
	MessageOutlined,
	MailOutlined,
	UserOutlined,
	SettingOutlined,
	EditOutlined
} from "@ant-design/icons"

import Account from "./Account"
import Chat from "./Chat"

const { TabPane } = Tabs

function callback(key) {
	console.log(key)
}

function Tab({ account }) {
	return (
		<div className="sp-main-tabs">
			<Tabs onChange={callback} type="card">
				<TabPane tab={<MessageOutlined />} key="chat">
					<Chat account={account} />
				</TabPane>
				<TabPane tab={<EditOutlined />} key="comment">
					comment
				</TabPane>
				<TabPane tab={<MailOutlined />} key="inbox">
					Content of Tab Pane 2
				</TabPane>
				<TabPane tab={<UserOutlined />} key="account">
					<Account account={account} />
				</TabPane>
				<TabPane tab={<SettingOutlined />} key="settings">
					Content of Tab Pane 4
				</TabPane>
			</Tabs>
		</div>
	)
}

export default Tab
