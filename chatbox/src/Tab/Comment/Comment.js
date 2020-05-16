import "./Comment.css"

import React, { createElement, useState, useEffect } from "react"
import { connect } from "react-redux"
import moment from "moment"
import { Select, Comment, message } from "antd"
import {
	LikeFilled,
	LikeOutlined,
	DislikeFilled,
	DislikeOutlined
} from "@ant-design/icons"
import InputWithPicker from "components/InputWithPicker"
import Header from "components/Header"
import AvatarWithPopover from "components/AvatarWithPopover"

import { messageUser } from "redux/actions"
import { getComments, postComment } from "./service"

const { Option } = Select

function CommentTab({ account, url = "abc.com", messageUser }) {
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
	const like = () => {}
	const dislike = () => {}
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
		<div className="sp-comment-tab">
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
			<div className="sp-comment-body">
				<div className="sp-comment-list">
					{comments.map(c => (
						<Comment
							key={c.id}
							actions={[
								<span key="comment-basic-like">
									{createElement(c.voted === 1 ? LikeFilled : LikeOutlined, {
										onClick: like
									})}
									<span className="comment-action">{c.score}</span>
								</span>,
								<span key="comment-basic-dislike">
									{React.createElement(
										c.voted === -1 ? DislikeFilled : DislikeOutlined,
										{
											onClick: dislike
										}
									)}
									<span className="comment-action">{c.score}</span>
								</span>
							]}
							author={c.user.name}
							avatar={
								<AvatarWithPopover
									user={c.user}
									messageUser={messageUser}
									popoverPlacement="right"
								/>
							}
							content={c.content.value}
							datetime={
								<span
									title={moment(c.created_at).format("YYYY-MM-DD HH:mm:ss")}
								>
									{moment(c.created_at).fromNow()}
								</span>
							}
						/>
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
			<InputWithPicker autoFocus={true} send={send} />
		</div>
	)
}

export default connect(null, { messageUser })(CommentTab)
