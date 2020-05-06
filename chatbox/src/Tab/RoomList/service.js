import axios from "axios"
// import config from "config"

export const getRooms = params => {
	return axios.get("https://api-v3.yiyechat.com/api/room", {
		params: params
	})
}

// export const createRoom = payload => {
// 	const formData = new FormData()
// 	Object.keys(payload).forEach(key => {
// 		const val = payload[key]
// 		if (val) {
// 			formData.append(key, val)
// 		}
// 	})
// 	return axios.post(urls.apiUrl + "/api/v1/create_room", formData)
// }
