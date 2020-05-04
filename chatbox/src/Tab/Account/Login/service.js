import axios from "axios"
import config from "config"

export const login = (userId, password) => {
	const payload = {
		userId: userId,
		password: password,
	}
	return axios.post(config.apiUrl + "/api/v1/login", payload)
}
