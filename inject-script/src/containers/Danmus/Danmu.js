import React, { Component } from "react"

class Danmu extends Component {
	state = {}
	constructor(props) {
		super(props)
		this.danmuRef = React.createRef()
	}

	componentDidMount() {
		let startX = window.innerWidth
		let duration = (startX + 1000) / 100

		//.animate isn't supported by safari
		// TODO: maybe use animation.js lib?
		if (!this.danmuRef.current.animate) {
			this.props.deleteSelf(this.props.danmu.id)
			return
		}
		let danmuAnimation = this.danmuRef.current.animate(
			[
				// keyframes, at least two
				{ transform: "translateX(" + startX + "px)" },
				{ transform: "translateX(-1000px)" },
			],
			{
				// timing options
				duration: duration * 1000,
				// easing: 'ease-in-out'
			}
		)
		danmuAnimation.onfinish = () => {
			this.props.deleteSelf(this.props.danmu.id)
		}
		this.danmuRef.current.onmouseover = () => {
			danmuAnimation.pause()
		}
		this.danmuRef.current.onmouseout = () => {
			danmuAnimation.play()
		}
		this.danmuRef.current.onmousedown = () => {
			window.toggleChatbox()
		}
	}
	render() {
		const data = this.props.danmu
		const user = data.user
		const content = data.content
		let contentClassName = "sp-danmu-content " + content.type

		if (data.self) {
			contentClassName += " self"
		}

		let avatar = ""
		if (user.avatarSrc) {
			avatar = (
				<img alt="" className="sp-danmu-avatar" src={user.avatarSrc} />
			)
		}

		let body = <span>{content.value}</span>
		if (content.type === "image") {
			body = <img alt="" src={content.value} />
		}
		return (
			<div
				className="sp-danmu-wrapper"
				style={{ top: this.props.danmu.top }}
				ref={this.danmuRef}
			>
				{this.props.danmu.roomName && (
					<span className="sp-danmu-room-name">
						[{this.props.danmu.roomName}]
					</span>
				)}
				{avatar}
				<span className={contentClassName}>{body}</span>
			</div>
		)
	}
}

export default Danmu
