import React from "react"
import "./Chat.css"

import { Tabs, Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"

import RoomTab from "./RoomTab"

const { TabPane } = Tabs

class Chat extends React.Component {
	constructor(props) {
		super(props)
		this.newTabIndex = 0
		const panes = [
			{ title: "Tab 1", content: "Content of Tab Pane 1", key: "1" },
			{ title: "Tab 2", content: "Content of Tab Pane 2", key: "2" }
		]
		this.state = {
			activeKey: panes[0].key,
			panes
		}
	}

	onChange = activeKey => {
		this.setState({ activeKey })
	}

	onEdit = (targetKey, action) => {
		this[action](targetKey)
	}

	add = () => {
		const { panes } = this.state
		const activeKey = `newTab${this.newTabIndex++}`
		panes.push({ title: "选择房间", key: activeKey })
		this.setState({ panes, activeKey })
	}

	remove = targetKey => {
		let { activeKey } = this.state
		let lastIndex
		this.state.panes.forEach((pane, i) => {
			if (pane.key === targetKey) {
				lastIndex = i - 1
			}
		})
		const panes = this.state.panes.filter(pane => pane.key !== targetKey)
		if (panes.length && activeKey === targetKey) {
			if (lastIndex >= 0) {
				activeKey = panes[lastIndex].key
			} else {
				activeKey = panes[0].key
			}
		}
		this.setState({ panes, activeKey })
	}

	setRoom = (room, paneIndex) => {
		const panes = this.state.panes

		const pane = {
			title: room.name,
			room: room,
			key: panes[paneIndex].key
		}
		// Need a new list or it's ok to just replace the pane
		panes[paneIndex] = pane
		this.setState({ panes })
	}

	render() {
		return (
			<div className="sp-chat-tabs">
				<Tabs
					tabBarExtraContent={
						<Button onClick={this.add}>
							<PlusOutlined />
						</Button>
					}
					hideAdd
					onChange={this.onChange}
					activeKey={this.state.activeKey}
					// type="editable-card" commented out otherwise style is a mess
					onEdit={this.onEdit}
					tabPosition="left"
				>
					{this.state.panes.map((pane, paneIndex) => (
						<TabPane tab={pane.title} key={pane.key}>
							<div className="sp-room-tab">
								<RoomTab
									setRoom={this.setRoom}
									paneIndex={paneIndex}
									room={pane.room}
								/>
							</div>
						</TabPane>
					))}
				</Tabs>
			</div>
		)
	}
}

export default Chat
