const defaultConfig = {
	debug: true,
	chatboxSrc: "https://urlchatbox.com",
	// apiUrl: "http://167.172.6.226",
	apiUrl: "https://web.chat-anywhere.com",
	// apiUrl: "http://localhost:8080",
	socketUrl: "wss://chat.chat-anywhere.com",
	// socketUrl: "ws://0.0.0.0:8765",
	// socketUrl: "wss://localhost:8765",
	heartbeatInterval: 10 * 1000,
	socketReconnectWaitTime: 3 * 1000,
	size: {
		width: 400,
		height: 600,
		minWidth: 350,
		minHeight: 40,
	},
	position: {
		x: 0,
		y: 0,
	},
	// icon: {
	// 	verticalCenter: true,
	// },
	autoConnect: true,
	activeTab: "chat",
	defaultRooms: [
		{
			type: "site",
			name: "网站大厅",
			about: "当前网站的所有用户都可以进入该房间。",
		},
		{
			type: "page",
			name: "同网页",
			about: "只有浏览当前网页的用户可以进入该房间。",
		},
	],
}

// const defaultConfig = {
// 	tabList: ["discover", "chat", "inbox", "profile", "close"],
// 	defaultTab: "chat",
// 	chatModes: ["site", "page", "room"],
// 	defaultChatView: "site",
// 	debug: false,
// 	socketUrl: "chat-v6.yiyechat.com/prod",
// 	// for getting data from chat cache
// 	chatApi: "https://api-v3.yiyechat.com",
// 	// apiUrl: "https://api-v2.yiyechat.com",
// 	apiUrl: "http://localhost:8080",
// 	chatboxSrc: "https://yiyechat.com/extension-v6/",

// 	autoConnect: false,
// 	showDanmu: true,
// 	showAvatars: true,
// }

if (process.env.REACT_APP_LOCAL_CHATBOX) {
	// defaultConfig.socketUrl = "http://localhost:8081"
	// defaultConfig.apiUrl = 'localhost:3000'
	defaultConfig.chatboxSrc = "https://localhost:3000"
}
if (process.env.REACT_APP_LOCAL_SOCKET) {
	defaultConfig.socketUrl = "localhost:8765"
}

let spConfig = { ...defaultConfig }
if (window.spConfig) {
	spConfig = { ...defaultConfig, ...window.spConfig }
}
if (!spConfig.debug) {
	console.debug = () => {}
}
window.spConfig = spConfig

export default spConfig
