// import store from "redux/store"

// import config from "config"
// let _socket = null

// const _isConnected = () => {
// 	return _socket && _socket.readyState === _socket.OPEN
// }

// const _createSocket = () => {
// 	console.debug("creating socket")
// 	_socket = new WebSocket(config.socketUrl)

// 	_socket.onmessage = e => {
// 		const msg = JSON.parse(e.data)
// 		console.log(123)
// 	}
// 	const hey = e => {
// 		const msg = JSON.parse(e.data)
// 		console.log("abc")
// 	}
// 	_socket.addEventListener("message", hey)

// 	_socket.removeEventListener("message", hey)
// 	_socket.addEventListener("message", function (e) {
// 		const msg = JSON.parse(e.data)
// 		console.log("ggg")
// 	})

// 	_socket.onmessage = e => {
// 		const msg = JSON.parse(e.data)
// 		console.log(321)
// 	}
// }

// function _sendEvent(payload) {
// 	const state = store.getState()

// 	payload.data.token = state.account.token
// 	if (_isConnected()) {
// 		_socket.send(JSON.stringify(payload))
// 	} else {
// 		_createSocket()
// 		console.debug("retry send event in 5 sec...")
// 		setTimeout(() => {
// 			_sendEvent(payload)
// 		}, 5000)
// 	}
// }

// export const joinRoom = room => {
// 	const payload = {
// 		action: "join_single",
// 		data: {
// 			room: room
// 		}
// 	}
// 	_sendEvent(payload)
// }

// export const sendMessage = data => {
// 	const payload = {
// 		action: "message",
// 		data: data
// 	}
// 	_sendEvent(payload)
// }
