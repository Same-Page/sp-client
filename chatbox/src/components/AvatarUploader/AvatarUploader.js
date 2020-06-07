import React from "react"
import { Avatar } from "antd"
import { UserOutlined, UploadOutlined } from "@ant-design/icons"

import ImageUploader from "react-images-upload"
import "./AvatarUploader.css"

class App extends React.Component {
	// code in this component including the stylesheet is a
	// mess, should use a different lib and rewrite
	constructor(props) {
		super(props)
		this.state = { pictures: [] }
		this.onDrop = this.onDrop.bind(this)
	}

	onDrop(picture) {
		// console.log(picture)
		this.setState({
			pictures: picture
		})
		this.props.setFile(picture[0])
	}

	render() {
		// this lib isn't easy to customize at all
		// had to use class to toggle upload button!
		let alreadySelectedImageClassName = ""
		let currentAvatar = ""
		if (this.state.pictures.length) {
			alreadySelectedImageClassName = "sp-selected-avatar"
		} else {
			currentAvatar = (
				<Avatar
					shape="square"
					style={{ margin: "10px auto", borderRadius: 5 }}
					size={200}
					src={this.props.avatarSrc}
					icon={<UserOutlined />}
				/>
			)
		}

		return (
			<>
				<ImageUploader
					className={alreadySelectedImageClassName}
					singleImage={true}
					buttonClassName="ant-btn"
					withPreview={true}
					withIcon={false}
					withLabel={false}
					// buttonText={this.props.intl.formatMessage({ id: "choose.image" })}
					buttonText={
						<>
							<UploadOutlined style={{ marginRight: 10 }} />
							更换头像
						</>
					}
					fileTypeError="文件类型不支持"
					fileSizeError="文件太大"
					onChange={this.onDrop}
					label="文件不能大于5MB"
					imgExtension={[".jpg", ".jpeg", ".png", ".gif"]}
					maxFileSize={5242880}
				/>
				{currentAvatar}
			</>
		)
	}
}
export default App
// const IntlWrapper = injectIntl(App)
// export default forwardRef((props, ref) => (
//   <IntlWrapper {...props} innerRef={ref}></IntlWrapper>
// ))
