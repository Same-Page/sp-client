import React, { useState } from "react"
import {
	LikeFilled,
	LikeOutlined,
	DislikeFilled,
	DislikeOutlined
} from "@ant-design/icons"
import { Comment, Modal, message } from "antd"
import moment from "moment"

import AvatarWithPopover from "AvatarWithPopover"

import { voteComment } from "../service"

function CommentItem({ c }) {
	const [score, setScore] = useState(c.my_score)
	const [likes, setLikes] = useState(c.like_count)
	const [dislikes, setDislikes] = useState(c.dislike_count)
	const [showMediaModal, setShowMediaModal] = useState(false)

	const vote = async (commentId, score) => {
		try {
			const payload = {
				commentId: commentId,
				score: score
			}
			const resp = await voteComment(payload)
			console.debug(resp.data)
		} catch (error) {
			message.error("失败！")
			console.error(error)
		}
	}

	let content = ""
	const contentType = c.content.type
	if (contentType === "text") {
		content = c.content.value
	} else if (contentType === "image") {
		content = <img alt={c.content.url} src={c.content.url} />
	}

	return (
		<>
			{showMediaModal && (
				<Modal
					closable={false}
					centered
					wrapClassName="sp-media-modal"
					visible={true}
					onCancel={() => {
						setShowMediaModal(false)
					}}
					footer={null}
					className="sp-modal"
				>
					<img alt={c.content.url} src={c.content.url} />
				</Modal>
			)}
			<Comment
				actions={[
					<span
						key="comment-basic-like"
						onClick={() => {
							setScore(prevScore => {
								let s = 0
								if (prevScore === 1) {
									// cancel like
									s = 0
									setLikes(l => {
										return l - 1
									})
								} else if (prevScore === -1) {
									// change from dislike to like
									s = 1
									setLikes(l => {
										return l + 1
									})
									setDislikes(d => {
										return d - 1
									})
								} else {
									// like
									s = 1
									setLikes(l => {
										return l + 1
									})
								}
								vote(c.id, s)
								return s
							})
						}}
					>
						{score === 1 ? <LikeFilled /> : <LikeOutlined />}
						<span style={{ marginLeft: 5 }}>{likes}</span>
					</span>,
					<span
						key="comment-basic-dislike"
						onClick={() => {
							setScore(prevScore => {
								let s = 0
								if (prevScore === -1) {
									// cancel dislike
									s = 0
									setDislikes(d => {
										return d - 1
									})
								} else if (prevScore === 1) {
									// change from like to dislike
									s = -1
									setLikes(l => {
										return l - 1
									})
									setDislikes(d => {
										return d + 1
									})
								} else {
									// dislike
									s = -1
									setDislikes(d => {
										return d + 1
									})
								}
								vote(c.id, s)
								return s
							})
						}}
					>
						{score === -1 ? <DislikeFilled /> : <DislikeOutlined />}
						<span style={{ marginLeft: 5 }}>{dislikes}</span>
					</span>
				]}
				author={c.user.name}
				avatar={<AvatarWithPopover user={c.user} popoverPlacement="right" />}
				content={
					<span
						onClick={() => {
							if (contentType === "image") {
								if (window.parent) {
									window.parent.postMessage({ imgSrc: c.content.url }, "*")
								} else {
									setShowMediaModal(true)
								}
							}
						}}
					>
						{content}
					</span>
				}
				datetime={
					<span title={moment(c.created_at).format("YYYY-MM-DD HH:mm:ss")}>
						{moment(c.created_at).fromNow()}
					</span>
				}
			/>
		</>
	)
}

export default CommentItem
