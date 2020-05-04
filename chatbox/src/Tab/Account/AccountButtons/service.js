import axios from "axios"
import config from "config"

export const logout = () => {
	return axios.post(config.apiUrl + "/api/v1/logout")
}
