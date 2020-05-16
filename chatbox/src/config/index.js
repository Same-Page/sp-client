const config = {
	apiUrl: "http://localhost:8080",
	socketUrl: "wss://localhost:8765",
	defaultRooms: [
		{
			type: "site",
			name: "大厅",
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
