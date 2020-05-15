import "./Comment.css"

import React, { useState, useEffect } from "react"
import { message } from "antd"

import InputWithPicker from "components/InputWithPicker"
import Conversation from "components/Conversation"
import Header from "components/Header"
import { Select } from "antd"

import { getComments, postComment } from "./service"

const { Option } = Select

function Comment({ account, url = "abc.com" }) {
	const [comments, setComments] = useState([])
	const [orderBy, setOrderBy] = useState("latest")
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
			<Header
				leftItems={<span style={{ marginLeft: 10 }}>在当前网页的留言</span>}
				rightItems={
					<Select
						value={orderBy}
						style={{ marginRight: 5 }}
						onChange={val => {
							setOrderBy(val)
						}}
						// size="small"
					>
						<Option value="latest">按时间排序</Option>
						<Option value="default">默认排序</Option>
					</Select>
				}
			/>

			<Conversation messages={comments} />

			<InputWithPicker autoFocus={true} send={send} />
		</div>
	)
}

export default Comment
