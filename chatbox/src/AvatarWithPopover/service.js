import axios from "axios"
import config from "config"

export const follow = (userId, follow) => {
	const payload = {
		id: userId,
		follow: follow
	}
	return axios.post(config.apiUrl + "/api/v1/follow", payload)
}
