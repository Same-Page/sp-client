import axios from "axios"
import config from "config"

export const signup = payload => {
	return axios.post(config.apiUrl + "/api/v1/register", payload)
}
