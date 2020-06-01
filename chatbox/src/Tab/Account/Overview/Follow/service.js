import axios from "axios"
import config from "config"

export const getFollowers = () => {
	return axios.get(config.apiUrl + "/api/v1/followers")
}

export const getFollowings = () => {
	return axios.get(config.apiUrl + "/api/v1/followings")
}
