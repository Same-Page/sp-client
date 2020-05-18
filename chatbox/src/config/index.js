const config = {
	apiUrl: "http://localhost:8080",
	socketUrl: "wss://localhost:8765",
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
	activeTab: "comment",
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
