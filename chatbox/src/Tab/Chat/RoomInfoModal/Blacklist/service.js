import axios from "axios"
import config from "config"

export const getBlacklistUsers = roomId => {
	return axios.get(config.apiUrl + `/api/v1/room/${roomId}/blacklist`)
}
