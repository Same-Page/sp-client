import axios from "axios"
import config from "config"

export const getConversations = offset => {
	const params = {
		offset: offset || -1
	}
	return axios.get(config.apiUrl + "/api/v1/messages", {
		params: params
	})
}

export const postMessage = (userId, content, offset) => {
	const payload = {
		userId: userId,
		content: content,
		offset: offset
	}

	return axios.post(config.apiUrl + "/api/v1/message", payload)
}
