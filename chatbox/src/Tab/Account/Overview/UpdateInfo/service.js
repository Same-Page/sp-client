import axios from "axios"
import config from "config"

export const updateInfo = payload => {
	const formData = new FormData()

	Object.keys(payload).forEach(k => {
		formData.append(k, payload[k])
	})

	return axios.post(config.apiUrl + "/api/v1/user", formData)
}
