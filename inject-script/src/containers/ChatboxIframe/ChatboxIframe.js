import "./ChatboxIframe.css"

import React, { useState, useEffect, useRef } from "react"
// import Button from "@material-ui/core/Button"
// import Input from "@material-ui/core/Input"

import { Rnd } from "react-rnd"
// import { mockUrl, getDomain } from "utils/url"
import { postMsgToIframe } from "utils/iframe"
import storage from "storage.js"
import SwapHorizIcon from "@material-ui/icons/SwapHoriz"

import config from "config"

import ImageModal from "../ImageModal"

const createIframeByDefault = false

// const defaultUrl = window.location.href
// let urlInput = defaultUrl
// let fakeUrl = false
// let curUrl = window.location.href

// function keepCheckingLocation() {
// 	// Stop this timer if url is ever manually set because
// 	// that's either local testing or the web version
// 	if (fakeUrl) return
// 	if (window.location.href === curUrl) {
// 		// window.spDebug('url not changed')
// 	} else {
// 		window.spDebug("url changed")
// 		curUrl = window.location.href

// 		postMsgToIframe("sp-url-changed", {
// 			title: document.title,
// 			url: window.location.href,
// 		})
// 	}
// 	setTimeout(() => {
// 		keepCheckingLocation()
// 	}, 10 * 1000)
// }

function ChatboxIframe({
	blacklist,
	chatboxCreated,
	setChatboxCreated,
	storageData,
}) {
	const [x, setX] = useState(5)
	const [size, setSize] = useState(config.size)
	const blacklistRef = useRef()
	blacklistRef.current = blacklist
	// window.createChatboxIframe = createChatboxIframe
	// const [url, setUrl] = useState(defaultUrl)
	const [display, setDisplay] = useState("block")

	const iframeRef = useRef()
	window.chatboxIframeRef = iframeRef
	const isChatboxOpen = chatboxCreated && display === "block"

	window.isChatboxOpen = isChatboxOpen

	useEffect(() => {
		// keepCheckingLocation()
		const toggleChatbox = () => {
			// if iframe not created, create iframe (default display)
			// if iframe is created, toggle show hide

			if (window.isChatboxOpen) {
				setDisplay("none")
			} else {
				setDisplay("block")
				setChatboxCreated(true)
			}
		}
		window.toggleChatbox = toggleChatbox

		window.addEventListener(
			"message",
			(e) => {
				if (!e || !e.data) return
				const data = e.data
				// change to data.action for consistency
				if (data.action === "close_chatbox") {
					setDisplay("none")
				}
				if (data.action === "update_storage") {
					// console.log(data)
					storage.set(data.key, data.value)
				}
				if (data.action === "update_storage_all") {
					for (const key in data.data) {
						console.debug(key)
						if (
							![
								"unread",
								"showDanmu",
								"showChatIcon",
								"showAvatar",
							].includes(key)
						) {
							// unread flag and settigns flag should only be pushed
							// when user make explicit action
							storage.set(key, data.data[key])
						}
					}
				}
				if (data.action === "get_url") {
					postMsgToIframe("url", window.location.href)
				}
				if (data.action === "get_unread") {
					if (storageData.unread) {
						// TODO: use unread state variable instead
						// also don't want to trigger useEffect multiple times
						postMsgToIframe("unread", storageData.unread)
					}
				}
				// if (data.action === "sp-parent-data") {
				// 	spDebug("post config & account to chatbox")
				// 	postMsgToIframe("sp-parent-data", {
				// 		spConfig: spConfig,
				// 		// pass account to chatbox to get the latest token
				// 		account: accountManager.getAccount(),
				// 		blacklist: blacklistRef.current
				// 	})
				// }
			},
			false
		)
		if (window.chrome && window.chrome.extension) {
			window.chrome.runtime.onMessage.addListener(
				(request, sender, sendResponse) => {
					if (!request.chatboxMsg) return
					var msg = request.chatboxMsg
					console.debug(msg)
					if (msg === "open_chatbox") {
						toggleChatbox()
					}
					if (msg === "is_chatbox_open") {
						sendResponse({
							is_chatbox_open: window.isChatboxOpen,
						})
					}
				}
			)
		}
		if (storageData.autoOpenChatbox == null) {
			setChatboxCreated(createIframeByDefault)
		} else {
			setChatboxCreated(storageData.autoOpenChatbox)
		}

		let iframeSize = config.size
		if (storageData.iframeSize) {
			setSize(storageData.iframeSize)
			iframeSize = storageData.iframeSize
		}

		if (storageData.iframeX) {
			let posX = Math.max(storageData.iframeX, 0)
			const iframeWidth = parseInt(iframeSize.width, 10)
			posX = Math.min(posX, window.innerWidth - iframeWidth - 10)

			setX(posX)
		}
	}, [storageData])

	// useEffect(() => {
	// 	if (window.location.href !== url && showIframeControl) {
	// 		mockUrl(url)
	// 		// socketManager.changeRoom(getDomain())
	// 	}
	// }, [url])

	return (
		<div className="sp-iframe-div">
			<ImageModal />

			{/* {showIframeControl && (
				<div>
					<h1>
						<br />
						<center>Same Page</center>
					</h1> */}
			{/* <div style={{ padding: 20, maxWidth: 500 }}>
						<span style={{ marginBottom: 5 }}>URL: </span>
						<Input
							style={{ width: 150, marginLeft: 5 }}
							placeholder="https://www.google.com"
							size="large"
							color="primary"
							variant="contained"
							defaultValue={urlInput}
							onChange={(e) => (urlInput = e.target.value)}
						/>
						<Button
							color="primary"
							variant="contained"
							className="sp-blue-button"
							style={{ marginLeft: 10 }}
							size="small"
							onClick={() => {
								setUrl(urlInput)
								fakeUrl = true
							}}
						>
							update!
						</Button>
					</div> */}
			{/* </div>
			)} */}

			{chatboxCreated && (
				<Rnd
					style={{ display: display }}
					className="sp-chatbox-iframe-wrapper"
					resizeHandleStyles={{
						right: { right: -10 },
					}}
					// position={{ x: x, y: 0 }}
					default={{
						x: x,
						y: 0, // y value is overridden in css
						width: size.width,
						height: size.height,
					}}
					minWidth={config.size.minWidth}
					minHeight={config.size.minHeight}
					maxHeight={window.innerHeight}
					dragAxis="x"
					onDragStop={(e, d) => {
						storage.set("iframeX", d.x)
					}}
					onResizeStop={(e, direction, ref, delta, position) => {
						storage.set("iframeSize", {
							width: ref.style.width,
							height: ref.style.height,
						})
						// console.log(ref.style.height)
					}}
				>
					<div className="sp-chatbox-drag-handle">
						<SwapHorizIcon />
					</div>
					<iframe
						allow="autoplay"
						allowFullScreen={true}
						webkitallowfullscreen="true"
						mozallowfullscreen="true"
						title="same page chat box"
						ref={iframeRef}
						className="sp-chatbox-iframe"
						// src={iframeSrc + "?" + url}
						src={config.chatboxSrc}
					/>
				</Rnd>
			)}
		</div>
	)
}

export default ChatboxIframe
