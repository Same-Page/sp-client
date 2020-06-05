import axios from "axios"
import config from "config"

export const login = payload => {
	return axios.post(config.apiUrl + "/api/v1/login", payload)
}
