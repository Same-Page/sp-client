import config from "config"
let _socket = null

export const createSocket = () => {
	_socket = new WebSocket(config.socketUrl)
	console.debug("create socket")
}
