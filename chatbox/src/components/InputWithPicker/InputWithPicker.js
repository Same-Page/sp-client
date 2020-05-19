import "./InputWithPicker.css"

// import { useIntl } from "react-intl"

import React, { useState, useRef, useEffect } from "react"
import { Button, Input, Upload } from "antd"
import { UploadOutlined } from "@ant-design/icons"

import axios from "axios"

function InputWithPicker(props) {
	const uploadUrl = `todo/api/v1/chat_upload`

	const [input, setInput] = useState("")
	const [uploading, setUploading] = useState(false)
	// const intl = useIntl()
	const inputRef = useRef()

	const sending = props.sending
	const autoFocus = props.autoFocus || false

	const uploadProps = {
		name: "file",
		action: uploadUrl,
		customRequest: options => {
			const data = new FormData()
			data.append("file", options.file)
			const fileName = options.file.name || "no-file-name"
			setUploading(true)
			axios
				.post(options.action, data)
				.then(resp => {
					const payload = {
						fileName: fileName,
						url: resp.data.url,
						type: "file"
					}
					props.send(payload)
				})
				.catch(err => {
					console.error(err)
				})
				.then(() => {
					setUploading(false)
				})
		},
		showUploadList: false,
		onChange(info) {
			// if (info.file.status !== "uploading") {
			//   console.log(info.file, info.fileList)
			// }
			// if (info.file.status === "done") {
			//   message.success(`${info.file.name} file uploaded successfully`)
			// } else if (info.file.status === "error") {
			//   message.error(`${info.file.name} file upload failed.`)
			// }
		}
	}

	useEffect(() => {
		if (autoFocus) {
			inputRef.current.focus()
		}
	}, [sending, autoFocus])

	const handleKeyDown = e => {
		if (e.key === "Enter") {
			if (input === "") {
				console.warn("Cannot send empty string")
				return
			}
			const payload = {
				value: input,
				type: "text"
			}
			const shouldClear = props.send(payload)
			if (shouldClear) {
				setInput("")
			}
		}
	}

	const handleChange = e => {
		setInput(e.target.value)
	}

	const addonBefore = (
		<span>
			<Upload {...uploadProps} disabled={uploading}>
				<Button loading={uploading}>
					<UploadOutlined />
				</Button>
			</Upload>
		</span>
	)

	return (
		<div className="sp-input-with-picker">
			<Input
				ref={inputRef}
				size="large"
				onKeyDown={handleKeyDown}
				value={input}
				addonBefore={addonBefore}
				// addonAfter={props.addonAfter}
				onChange={handleChange}
				disabled={sending}
				placeholder="输入。。。"
				// placeholder={
				//   sending
				//     ? intl.formatMessage({ id: "sending" })
				//     : intl.formatMessage({ id: "input.here" })
				// }
			/>
		</div>
	)
}

export default InputWithPicker
