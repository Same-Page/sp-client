import "./Comment.css"

import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Select, message } from "antd"

import InputWithPicker from "components/InputWithPicker"
import Header from "components/Header"
import LoadingAlert from "components/Alert/LoadingAlert"
import Alert from "components/Alert"
import CommentItem from "./CommentItem"
import { messageUser } from "redux/actions"
import { getComments, postComment } from "./service"

const { Option } = Select

function CommentTab({ account, url = "abc.com", messageUser }) {
	const [comments, setComments] = useState([])
	const [orderBy, setOrderBy] = useState("default")
	const [loading, setLoading] = useState(false)
	useEffect(() => {
		async function fetchData(payload) {
			setLoading(true)
			try {
				const resp = await getComments(payload)
				setComments(resp.data)
			} catch (error) {
				message.error("留言获取失败！")
				console.error(error)
			}
			setLoading(false)
		}
		const payload = {
			url: url,
			order: orderBy
		}
		fetchData(payload)
	}, [url, account, orderBy])

	const send = async content => {
		try {
			const payload = {
				content: content,
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
		<div className="sp-flex-body sp-comment-tab">
			<Header
				leftItems={
					<span style={{ marginLeft: 10 }}>
						当前网页有{comments.length}条留言
					</span>
				}
				rightItems={
					<Select
						value={orderBy}
						style={{ marginRight: 5 }}
						onChange={val => {
							setOrderBy(val)
						}}
						dropdownClassName="sp-comment-order-dropdown"
					>
						<Option value="latest">按时间排序</Option>
						<Option value="default">默认排序</Option>
					</Select>
				}
			/>
			{loading && <LoadingAlert text="载入中。。。" />}
			<div className="sp-comment-body">
				<div className="sp-comment-list">
					{comments.map(c => (
						<CommentItem key={c.id} c={c} messageUser={messageUser} />
					))}
				</div>
			</div>
			{/* Not using ant List because I get colStyle warning from React
				look at ant List again for pagination
			*/}
			{/* <List
				// className="comment-list"
				itemLayout="vertical"
				dataSource={comments}
				locale={{ emptyText: " " }}
				renderItem={c => (
					<li>
						
					</li>
				)}
			/> */}
			{account && <InputWithPicker autoFocus={true} send={send} />}
			{!account && <Alert text="登录后方可评论" border="top" />}
		</div>
	)
}

export default connect(null, { messageUser })(CommentTab)
