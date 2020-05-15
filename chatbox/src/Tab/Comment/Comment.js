import "./Comment.css"

import React, { useState, useEffect } from "react"
import { message } from "antd"

import InputWithPicker from "components/InputWithPicker"
import Conversation from "components/Conversation"
import { getComments, postComment } from "./service"

function Comment({ account, url = "abc.com" }) {
	const [comments, setComments] = useState([])
	useEffect(() => {
		async function fetchData(payload) {
			try {
				const resp = await getComments(payload)
				setComments(resp.data)
			} catch (error) {
				message.error("留言获取失败！")
				console.error(error)
			}
		}
		const payload = {
			url: url
		}
		fetchData(payload)
	}, [url, account])
	const send = async content => {
		try {
			const payload = {
				content: content.value,
				url: url
			}
			const resp = await postComment(payload)
			setComments(resp.data)
		} catch (error) {
			message.error("留言失败！")
			console.error(error)
		}
	}
	return (
		<div>
			<div className="sp-room-top-bar">
				<span style={{ marginLeft: 10 }}>网页留言</span>
			</div>
			<Conversation messages={comments} />

			<InputWithPicker autoFocus={true} send={send} />
		</div>
	)
}

export default Comment
