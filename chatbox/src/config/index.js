// TODO: config should be overwriten by injection script
const config = {
	apiUrl: "https://web.chat-anywhere.com",
	// apiUrl: "http://localhost:8080",
	socketUrl: "wss://chat.chat-anywhere.com",
	// socketUrl: "ws://0.0.0.0:8765",
	// socketUrl: "wss://localhost:8765",
	heartbeatInterval: 10 * 1000,
	socketReconnectWaitTime: 3 * 1000,
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
