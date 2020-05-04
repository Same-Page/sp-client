import "antd/dist/antd.css"
import "./Tab.css"
import React from "react"
import { Tabs } from "antd"
import {
	MessageOutlined,
	MailOutlined,
	UserOutlined,
	SettingOutlined,
	EditOutlined,
} from "@ant-design/icons"

import Account from "./Account"

const { TabPane } = Tabs

function callback(key) {
	console.log(key)
}

function Tab() {
	return (
		<Tabs onChange={callback} type="card">
			<TabPane tab={<MessageOutlined />} key="1">
				hi
			</TabPane>
			<TabPane tab={<EditOutlined />} key="comment">
				comment
			</TabPane>
			<TabPane tab={<MailOutlined />} key="2">
				Content of Tab Pane 2
			</TabPane>
			<TabPane tab={<UserOutlined />} key="user">
				<Account />
			</TabPane>
			<TabPane tab={<SettingOutlined />} key="settings">
				Content of Tab Pane 4
			</TabPane>
		</Tabs>
	)
}

export default Tab
