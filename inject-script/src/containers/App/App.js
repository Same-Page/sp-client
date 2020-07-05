import React, { useState, useEffect } from "react"

import axios from "axios"
import ChatboxIframe from "../ChatboxIframe"
import Rooms from "../Rooms"
import Danmus from "../Danmus"
import ChatIcon from "../ChatIcon"

import storageManager from "storage"
import config from "config"

function App() {
	// wait for localStorage finish loading before rendering anything
	// ready can only change from false to true for one time!
	const [account, setAccount] = useState(null)
	const [ready, setReady] = useState(false)
	const [chatboxCreated, setChatboxCreated] = useState(false)
	const [storageData, setStorageData] = useState()
	const [socket, setSocket] = useState(null)
	const [userCount, setUserCount] = useState()
	const [roomName, setRoomName] = useState()
	const [unread, setUnread] = useState(false)
	const [hidden, setHidden] = useState(false)

	// since connected is also set in useEffect, it causes infinite loop
	const [disconnectedCounter, setDisconnectedCounter] = useState(0)
	// const [socketIsLoggedIn, setSocketIsLoggedIn] = useState(false)

	const token = account && account.token
	useEffect(() => {
		// Load everything from localStorage
		// register all localstorage listeners
		storageManager.addEventListener("account", (account) => {
			setAccount(account)
		})
		storageManager.addEventListener("unread", (unread) => {
			setUnread(!!unread)
		})
		// pass null as storage key to get all stored data
		storageManager.get(null, (data) => {
			setStorageData(data || {})
			if (data.account) {
				setAccount(data.account)
			}
			if (data.unread) {
				setUnread(!!data.unread)
			}
			setReady(true)
		})
		const visibilityChangeHandler = () => {
			setHidden(document.hidden)
		}
		document.addEventListener(
			"visibilitychange",
			visibilityChangeHandler,
			false
		)
		setHidden(document.hidden)
		// Not unregistering since this component is never unmounted
	}, [])

	useEffect(() => {
		if (!hidden && token && !socket) {
			setDisconnectedCounter((counter) => {
				return counter + 1
			})
		}
	}, [hidden, token])

	useEffect(() => {
		// console.log("hidden", document.hidden)
		// if (!chatboxCreated && token) {
		if (token && !document.hidden) {
			console.debug("creating socket")
			const s = new WebSocket(config.socketUrl)
			window.spSocket = s
			const socketOpenHandler = () => {
				console.debug("socket connected")
				// setConnected(true)
				s.wasConnected = true

				const socketPayload = {
					action: "login",
					data: {
						token: token,
					},
				}
				s.send(JSON.stringify(socketPayload))
			}
			const socketCloseHandler = () => {
				if (s.wasConnected) {
					// Show error to user only if it was connected before
					// Otherwise when there is no Internet, this will show
					// repeatedly
					console.error("聊天服务器连接断开！")
				}
				s.closed = true
				// setConnected(false)
				setDisconnectedCounter((counter) => {
					return counter + 1
				})
				setSocket(null)
				console.debug("socket disconnected")
			}
			const socketMessageHandler = (e) => {
				const msg = JSON.parse(e.data)
				if (msg.name === "login") {
					if (msg.success) {
						console.debug("聊天服务器登录成功!")
						setSocket(s)
						// setSocketIsLoggedIn(true)
					} else {
						// delete account data to force user re-login
						storageManager.set("account", null)
					}
				}

				if (msg.error) {
					console.error(msg.error)
				}
			}

			s.addEventListener("open", socketOpenHandler)
			s.addEventListener("close", socketCloseHandler)
			s.addEventListener("message", socketMessageHandler)

			// setSocket(s)

			return () => {
				window.spSocket = null
				// unregister callbacks
				s.removeEventListener("open", socketOpenHandler)
				s.removeEventListener("close", socketCloseHandler)
				s.removeEventListener("message", socketMessageHandler)
				if (!s.closed) {
					s.close()
					s.closed = true
				}
				setSocket(null)
				// setConnected(false)
				// setSocketIsLoggedIn(false)
			}
		}
	}, [disconnectedCounter, token])

	useEffect(() => {
		console.debug("token changed", token)
		if (token) {
			axios.defaults.headers.common["token"] = token
		} else {
			delete axios.defaults.headers.common["token"]
		}
	}, [token])

	useEffect(() => {
		if (storageData && !storageData.unread && token) {
			// can't make ajax call in content script since chrome 73
			// proxy through background script
			const offset = (storageData && storageData.lastMsgId) || -1
			const url = `${config.apiUrl}/api/v1/messages?offset=${offset}`

			if (window.chrome && window.chrome.extension) {
				const headers = {
					token: token,
				}
				window.chrome.runtime.sendMessage(
					{
						makeRequest: true,
						url: url,
						options: {
							method: "GET",
							headers: headers,
						},
					},
					(response) => {
						if (response && response.ok) {
							if (Object.keys(response.data).length !== 0) {
								storageManager.set(
									"unread",
									Object.keys(response.data).length
								)
							}
							// console.log(response.data)
						} else {
							console.error(response)
						}
					}
				)
			} else {
				axios
					.get(url)
					.then((response) => {
						if (Object.keys(response.data).length !== 0) {
							storageManager.set(
								"unread",
								Object.keys(response.data).length
							)
						}
					})
					.catch((err) => {
						console.error(err)
					})
					.then((res) => {})
			}
		}
	}, [token, storageData])

	if (!ready) {
		return ""
	}
	return (
		<>
			{/* <ChatboxIframe blacklist={blacklist} /> */}

			<ChatIcon
				storageData={storageData}
				userCount={userCount}
				roomName={roomName}
				unread={unread}
			/>

			<Danmus />

			<ChatboxIframe
				unread={unread}
				storageData={storageData}
				chatboxCreated={chatboxCreated}
				setChatboxCreated={setChatboxCreated}
			/>
			{account && (
				<Rooms
					userId={account.id}
					storageData={storageData}
					socket={socket}
					setUserCount={setUserCount}
					setRoomName={setRoomName}
					// socket={socketIsLoggedIn ? socket : null}
				/>
			)}
		</>
	)
}

export default App
