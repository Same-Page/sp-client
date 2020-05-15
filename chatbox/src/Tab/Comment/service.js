import axios from "axios"
import config from "config"

export const getComments = payload => {
	return axios.post(config.apiUrl + "/api/v1/get_comments", payload)
}

export const postComment = payload => {
	return axios.post(config.apiUrl + "/api/v1/comment", payload)
}
