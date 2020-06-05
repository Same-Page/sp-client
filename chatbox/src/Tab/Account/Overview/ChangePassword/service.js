import axios from "axios"
import config from "config"

export const changePassword = payload => {
	return axios.post(config.apiUrl + "/api/v1/change_password", payload)
}
