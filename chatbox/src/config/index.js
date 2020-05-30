const config = {
	// apiUrl: "http://167.172.6.226",
	apiUrl: "http://localhost:8080",
	socketUrl: "ws://167.172.6.238:8765",
	// socketUrl: "ws://0.0.0.0:8765",
	heartbeatInterval: 5 * 1000,
	socketReconnectWaitTime: 3 * 1000,
	size: {
		width: 400,
		height: 600,
		minWidth: 350,
		minHeight: 350
	},
	position: {
		x: 0,
		y: 0
	},
	activeTab: "chat",
	defaultRooms: [
		{
			type: "site",
			name: "网站大厅",
			about: "当前网站的所有用户都可以进入该房间。"
		},
		{
			type: "page",
			name: "同网页",
			about: "只有浏览当前网页的用户可以进入该房间。"
		}
	]
}

export default config
