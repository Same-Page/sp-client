import axios from "axios"
import config from "config"
import { buildFormData } from "utils"

export const createRoom = payload => {
	return axios.post(config.apiUrl + "/api/v1/room", buildFormData(payload))
}

export const updateRoomInfo = payload => {
	return axios.put(config.apiUrl + "/api/v1/room", buildFormData(payload))
}
export const getRoomInfo = (roomId, roomType) => {
	const payload = {
		roomId,
		roomType
	}
	return axios.post(config.apiUrl + `/api/v1/room`, payload)
}
export const getRooms = (url, domain, userId) => {
	const payload = {
		userId,
		url,
		domain
	}
	return axios.post(config.apiUrl + "/api/v1/get_rooms", payload)
}

export const blacklistUserFromRoom = (userId, roomId, roomType, add) => {
	const payload = {
		userId,
		roomId,
		roomType,
		add
	}
	return axios.post(config.apiUrl + "/api/v1/room/blacklist", payload)
}
