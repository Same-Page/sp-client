import axios from "axios"
import config from "config"

export const signup = (email, name, password, website) => {
	const payload = {
		password: password,
		name: name,
		email: email,
		website: website,
	}
	return axios.post(config.apiUrl + "/api/v1/register", payload)
}
