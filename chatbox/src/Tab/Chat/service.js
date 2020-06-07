import axios from "axios"
import config from "config"

function buildFormData(payload) {
	const formData = new FormData()

	Object.keys(payload).forEach(k => {
		if (payload[k]) {
			// don't send null value to backend
			formData.append(k, payload[k])
		}
	})
	return formData
}

export const createRoom = payload => {
	return axios.post(config.apiUrl + "/api/v1/room", buildFormData(payload))
}

export const updateRoomInfo = payload => {
	return axios.put(config.apiUrl + "/api/v1/room", buildFormData(payload))
}
